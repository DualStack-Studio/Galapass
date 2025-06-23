package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.UserPatchRequest;
import com.galapass.api.entity.Role;
import com.galapass.api.entity.User;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TourCompanyRepository tourCompanyRepository;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (user.getCompany() != null && user.getCompany().getName() != null) {
            tourCompanyRepository.findByName(user.getCompany().getName())
                    .ifPresent(user::setCompany);
        }
        return userRepository.save(user);
    }


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> updateUser(User userUpdate) {
        return userRepository.findById(userUpdate.getId())
                .map(existingUser -> {
                    try {
                        existingUser.setName(userUpdate.getName());
                        existingUser.setEmail(userUpdate.getEmail());
                        existingUser.setPassword(userUpdate.getPassword());
                        existingUser.setRole(userUpdate.getRole());
                        existingUser.setBio(userUpdate.getBio());
                        existingUser.setProfilePhoto(userUpdate.getProfilePhoto());
                        existingUser.setLanguage(userUpdate.getLanguage());

                        if (userUpdate.getCompany() != null && userUpdate.getCompany().getName() != null) {
                            tourCompanyRepository.findByName(userUpdate.getCompany().getName())
                                    .ifPresent(existingUser::setCompany);
                        }

                        return userRepository.save(existingUser);
                    } catch (Exception e) {
                        return null;
                    }
                });
    }

    public User patchUser(Long userId, UserPatchRequest request) {
        // 1. Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // 2. Check each field from the request and update if it's not null
        if (request.getName() != null) {
            existingUser.setName(request.getName());
        }
        if (request.getEmail() != null) {
            // You might want to add logic here to check if the new email is already taken
            existingUser.setEmail(request.getEmail());
        }
        if (request.getBio() != null) {
            existingUser.setBio(request.getBio());
        }
        if (request.getLanguage() != null) {
            existingUser.setLanguage(request.getLanguage());
        }
        if (request.getProfilePhoto() != null) {
            existingUser.setProfilePhoto(request.getProfilePhoto());
        }

        // !! IMPORTANT !! Handle password separately for security
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            // You MUST encode the new password before saving it
           // existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 3. Save the updated user
        return userRepository.save(existingUser);
    }
    public User updateUserRole(Long userId, String newRole) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        existingUser.setRole(Role.valueOf(newRole));
        return userRepository.save(existingUser);
    }


    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}
