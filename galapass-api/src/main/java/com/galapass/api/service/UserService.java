package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.entity.User;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public User updateUser(User userUpdate) {
        return userRepository.findById(userUpdate.getId())
                .map(existingUser -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingUser, userUpdate);
                        return userRepository.save(existingUser);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update user", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userUpdate.getId() + " not found."));
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}