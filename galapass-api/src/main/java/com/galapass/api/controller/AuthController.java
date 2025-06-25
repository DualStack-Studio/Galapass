package com.galapass.api.controller;

import com.galapass.api.entity.AuthResponse;
import com.galapass.api.entity.LoginRequest;
import com.galapass.api.entity.RegisterRequest;
import com.galapass.api.DTO.UserResponse;
import com.galapass.api.jwt.JwtUtils;
import com.galapass.api.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// --- Add these imports ---
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletResponse;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private static final long JWT_COOKIE_MAX_AGE = Duration.ofDays(30).getSeconds();

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
                .sameSite("Lax")      // Good CSRF protection
                .build();

        // 4. Add the cookie to the response headers
        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 5. Return a response body without the token
        return ResponseEntity.ok(AuthResponse.builder().message("Login successful").build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest registerRequest,
            HttpServletResponse servletResponse // Also add it here for consistency
    ) {
        String jwtToken = authService.register(registerRequest);

        ResponseCookie cookie = ResponseCookie.from("jwt-token", jwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(JWT_COOKIE_MAX_AGE)
                .sameSite("Lax")
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
        // Clear the JWT cookie
        ResponseCookie cookie = ResponseCookie.from("jwt-token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // This expires the cookie immediately
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(AuthResponse.builder().message("Logout successful").build());
    }
}
