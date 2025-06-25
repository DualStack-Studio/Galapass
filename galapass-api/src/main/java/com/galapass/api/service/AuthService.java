package com.galapass.api.service;

import com.galapass.api.DTO.UserResponse;
import com.galapass.api.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // The method now returns a simple String
    public String login(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        UserDetails user = userService.getUserByEmail(loginRequest.getEmail()).orElseThrow();
        return jwtService.getToken(user); // Just return the token
    }

    // This method also returns a simple String
    public String register(RegisterRequest registerRequest) {
        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .name(registerRequest.getName())
                .language(registerRequest.getLanguage())
                .role(Role.GUIDE)
                .build();
        userService.createUser(user);

        return jwtService.getToken(user); // Just return the token
    }

    public UserResponse getCurrentUser(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token is missing.");
        }

        // Extract username/email from the token
        String email = jwtService.getUsernameFromToken(token);

        // Fetch full user details from DB
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate the token against the user
        if (!jwtService.isTokenValid(token, user)) {
            throw new SecurityException("Token is invalid or expired.");
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole())
                .build();
    }
}
