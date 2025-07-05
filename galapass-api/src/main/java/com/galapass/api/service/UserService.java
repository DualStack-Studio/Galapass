package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.user.UserPatchRequest;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.user.GuideStatus;
import com.galapass.api.entity.user.Role;
import com.galapass.api.entity.user.User;
import com.galapass.api.mapper.UserMapper;
import com.galapass.api.repository.GuideReviewRepository;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final TourCompanyRepository tourCompanyRepository;
    private final GuideReviewRepository guideReviewRepository;
    private final PasswordEncoder passwordEncoder;


    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (user.getRole() == Role.GUIDE) {
            user.setStatus(GuideStatus.OPERABLE);
        } else {
            user.setStatus(null);
        }

        Set<TourCompany> companies = new HashSet<>();
        if (user.getCompanies() != null) {
            for (TourCompany company : user.getCompanies()) {
                TourCompany dbCompany = tourCompanyRepository.findById(company.getId())
                        .orElseThrow(() -> new RuntimeException("Company not found with ID: " + company.getId()));
                companies.add(dbCompany);
                dbCompany.getGuides().add(user);
            }
        }
        user.setCompanies(companies);

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
                    existingUser.setName(userUpdate.getName());
                    existingUser.setEmail(userUpdate.getEmail());
                    existingUser.setBio(userUpdate.getBio());
                    existingUser.setProfilePhoto(userUpdate.getProfilePhoto());
                    existingUser.setLanguage(userUpdate.getLanguage());

                    // ✅ Password handling (hash if needed)
                    if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
                        existingUser.setPassword(userUpdate.getPassword()); // Hash if necessary
                    }

                    // ✅ Role update and Guide Status handling
                    existingUser.setRole(userUpdate.getRole());
                    if (userUpdate.getRole() == Role.GUIDE) {
                        existingUser.setStatus(GuideStatus.OPERABLE);
                    } else {
                        existingUser.setStatus(null);
                    }

                    // ✅ Handle Many-to-Many companies
                    if (userUpdate.getCompanies() != null) {
                        Set<TourCompany> updatedCompanies = new HashSet<>();

                        for (TourCompany company : userUpdate.getCompanies()) {
                            if (company.getId() != null) {
                                TourCompany dbCompany = tourCompanyRepository.findById(company.getId())
                                        .orElseThrow(() -> new RuntimeException("Company not found with ID: " + company.getId()));
                                updatedCompanies.add(dbCompany);
                            }
                        }

                        // ✅ Update both sides of the relationship
                        existingUser.getCompanies().clear();
                        existingUser.getCompanies().addAll(updatedCompanies);

                    }

                    return userRepository.save(existingUser);
                });
    }


    public UserResponse patchUser(Long userId, UserPatchRequest request) {
        // 1. Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // 2. Update name
        if (request.getName() != null) {
            existingUser.setName(request.getName());
        }

        // 3. Update email (add optional validation if needed)
        if (request.getEmail() != null) {
            existingUser.setEmail(request.getEmail());
        }

        // 4. Update bio
        if (request.getBio() != null) {
            existingUser.setBio(request.getBio());
        }

        // 5. Update language
        if (request.getLanguage() != null) {
            existingUser.setLanguage(request.getLanguage());
        }

        // 6. Update profile photo
        if (request.getProfilePhoto() != null) {
            existingUser.setProfilePhoto(request.getProfilePhoto());
        }

        // 7. Update role
        if (request.getRole() != null) {
            Role newRole = Role.valueOf(request.getRole().toUpperCase());

            existingUser.setRole(newRole);

            // ✅ Handle status based on role
            if (newRole == Role.GUIDE) {
                // If switching to GUIDE and no status was provided, set default
                if (request.getStatus() != null) {
                    existingUser.setStatus(GuideStatus.valueOf(request.getStatus().toUpperCase()));
                } else if (existingUser.getStatus() == null) {
                    existingUser.setStatus(GuideStatus.OPERABLE);
                }
            } else {
                // 🔥 If not a GUIDE, status should be null
                existingUser.setStatus(null);
            }
        }

        // Allow updating guide status if already GUIDE
        if (request.getStatus() != null && existingUser.getRole() == Role.GUIDE) {
            existingUser.setStatus(GuideStatus.valueOf(request.getStatus().toUpperCase()));
        }

        // 8. Handle password separately
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 9. Save the user
        User updatedUser = userRepository.save(existingUser);

        // Convert to DTO using your mapper
        return userMapper.toUserResponse(updatedUser);
    }

    public List<UserResponse> getUsersByRole(String role) {
        Role roleEnum = Role.valueOf(role.toUpperCase());

        return userRepository.findByRole(roleEnum)
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public List<UserResponse> getGuideByName(String name) {
        Role guideRole = Role.GUIDE;

        return userRepository.getGuideByName(guideRole, name)
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }


    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    public double calculateAverageGuideRating(Long guideId) {
        Double avg = guideReviewRepository.getAverageRatingByGuideId(guideId);
        return avg != null ? avg : 0.0;
    }

}
