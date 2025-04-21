package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
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


    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}
