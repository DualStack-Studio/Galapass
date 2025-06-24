package com.galapass.api.controller;

import com.galapass.api.entity.AuthResponse;
import com.galapass.api.entity.LoginRequest;
import com.galapass.api.entity.RegisterRequest;
import com.galapass.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// --- Add these imports ---
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
                .maxAge(60 * 60 * 24) // Set expiration (e.g., 1 day in seconds)
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
                .maxAge(60 * 60 * 24)
                .sameSite("Lax")
                .build();

        servletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(AuthResponse.builder().message("Registration successful").build());
    }
}
