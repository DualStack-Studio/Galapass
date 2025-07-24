package com.galapass.api.service;

import com.galapass.api.DTO.user.LoginRequest;
import com.galapass.api.DTO.user.RegisterRequest;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.user.Role;
import com.galapass.api.entity.user.User;
import com.galapass.api.user.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    @Value("${google.clientId}")
    private String googleClientId;

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
                .role(Role.TOURIST)
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
                .role(String.valueOf(user.getRole()))
                .build();
    }

    public String loginWithGoogle(String idTokenString) {
        try {
            var verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
            )
                    .setAudience(List.of(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new IllegalArgumentException("Invalid ID token.");
            }

            var payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userService.getUserByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .email(email)
                        .name(name)
                        .password("")
                        .role(Role.TOURIST)
                        .language("en")
                        .build();
                return userService.createUser(newUser);
            });

            return jwtService.getToken(user);

        } catch (Exception e) {
            throw new RuntimeException("Google login failed", e);
        }
    }
}
