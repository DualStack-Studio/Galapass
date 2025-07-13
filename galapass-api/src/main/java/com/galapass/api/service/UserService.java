package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.guideDashboard.GuideDashboardStatsDTO;
import com.galapass.api.DTO.user.UserCompaniesDTO;
import com.galapass.api.DTO.user.UserPatchRequest;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.CompanyTourStatus;

import com.galapass.api.entity.user.GuideStatus;
import com.galapass.api.entity.user.Role;
import com.galapass.api.entity.user.User;
import com.galapass.api.mapper.UserMapper;
import com.galapass.api.repository.GuideReviewRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.HashSet;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final TourCompanyRepository tourCompanyRepository;
    private final GuideReviewRepository guideReviewRepository;
    private final TourRepository tourRepository;
    private final PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<UserCompaniesDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserCompaniesDTO)
                .collect(Collectors.toList());
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

        if (request.getName() != null) {
            existingUser.setName(request.getName());
        }
        if (request.getEmail() != null) {
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

        if (request.getRole() != null) {
            Role newRole = Role.valueOf(request.getRole().toUpperCase());
            existingUser.setRole(newRole);

            if (newRole == Role.GUIDE) {
                if (request.getStatus() != null) {
                    existingUser.setStatus(GuideStatus.valueOf(request.getStatus().toUpperCase()));
                } else if (existingUser.getStatus() == null) {
                    existingUser.setStatus(GuideStatus.OPERABLE);
                }
            } else {
                existingUser.setStatus(null);
            }
        }

        if (request.getStatus() != null && existingUser.getRole() == Role.GUIDE) {
            existingUser.setStatus(GuideStatus.valueOf(request.getStatus().toUpperCase()));
        }

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

//    public GuideDashboardStatsDTO getGuideDashboardStats(Long guideId) {
//        long activeTours = tourRepository.countToursByGuideIdAndStatus(guideId, CompanyTourStatus.ACTIVE);
//        double averageRating = calculateAverageGuideRating(guideId);
//        BigDecimal totalEarnings = tourRepository.sumEarningsByGuideId(guideId, CompanyTourStatus.ACTIVE);
//        if (totalEarnings == null) {
//            totalEarnings = BigDecimal.ZERO;
//        }
//
//        // Upcoming/completed counts should now be handled by BookingService/Repository
//        return new GuideDashboardStatsDTO(
//                activeTours,
//                0L, // placeholder for upcoming bookings
//                0L, // placeholder for completed bookings
//                averageRating,
//                totalEarnings
//        );
//    }
}
