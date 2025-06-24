package com.galapass.api.service;

import com.galapass.api.entity.*;
import com.galapass.api.repository.UserRepository;
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
}
