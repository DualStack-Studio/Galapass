package com.galapass.api.auth.controller;


import com.galapass.api.auth.DTO.AuthResponse;
import com.galapass.api.auth.DTO.LoginRequest;
import com.galapass.api.auth.DTO.RegisterRequest;
import com.galapass.api.user.DTO.user.UserResponse;
import com.galapass.api.jwt.JwtUtils;
import com.galapass.api.auth.service.AuthService;
import com.google.api.client.util.Value;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Map;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private static final long JWT_COOKIE_MAX_AGE = Duration.ofDays(30).getSeconds();

    @Value("${google.clientId}")
    private String googleClientId;

    @PostMapping(value = "login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse servletResponse // 1. Inject HttpServletResponse
    ) {
        // 2. The service now just returns the token string
        String jwtToken = authService.login(loginRequest);

        // 3. Create the HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("jwt-token", jwtToken) // Cookie name and value
                .httpOnly(true)       // Crucial: Makes it inaccessible to JavaScript
                .secure(true)         // Recommended for production (HTTPS only)
                .path("/")            // Makes the cookie available to your whole site
                .maxAge(JWT_COOKIE_MAX_AGE) // Set expiration (e.g., 1 day in seconds)
                .sameSite("None")      // Good CSRF protection
                .build();

        // 4. Add the cookie to the response headers
        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 5. Return a response body without the token
        return ResponseEntity.ok(AuthResponse.builder().message("Login successful").build());
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody Map<String, String> body,
            HttpServletResponse servletResponse
    ) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String jwtToken = authService.loginWithGoogle(idToken);

        ResponseCookie cookie = ResponseCookie.from("jwt-token", jwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(30))
                .sameSite("None")
                .build();

        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(AuthResponse.builder().message("Google login successful").build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest registerRequest,
            HttpServletResponse servletResponse
    ) {
        String jwtToken = authService.register(registerRequest);

        ResponseCookie cookie = ResponseCookie.from("jwt-token", jwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(JWT_COOKIE_MAX_AGE)
                .sameSite("None")
                .build();

        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(AuthResponse.builder().message("Registration successful").build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            // Extract JWT from cookie
            String token = JwtUtils.extractTokenFromCookies(request, "jwt-token");
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Validate token and get user info
            UserResponse userInfo = authService.getCurrentUser(token);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt-token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // This expires the cookie immediately
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(AuthResponse.builder().message("Logout successful").build());
    }
}
