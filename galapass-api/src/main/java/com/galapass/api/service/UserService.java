package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.guideDashboard.GuideDashboardStatsDTO;
import com.galapass.api.DTO.user.UserPatchRequest;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.tour.TourStatus;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (user.getRole() == Role.GUIDE) {
            user.setStatus(GuideStatus.OPERABLE);
        } else {
            user.setStatus(null);
        }

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

        return userRepository.save(existingUser);
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

    public GuideDashboardStatsDTO getGuideDashboardStats(Long guideId) {
        long activeTours = tourRepository.countToursByGuideIdAndStatus(guideId, TourStatus.ACTIVE);
        double averageRating = calculateAverageGuideRating(guideId);
        BigDecimal totalEarnings = tourRepository.sumEarningsByGuideId(guideId, TourStatus.ACTIVE);
        if (totalEarnings == null) {
            totalEarnings = BigDecimal.ZERO;
        }

        // Upcoming/completed counts should now be handled by BookingService/Repository
        return new GuideDashboardStatsDTO(
                activeTours,
                0L, // placeholder for upcoming bookings
                0L, // placeholder for completed bookings
                averageRating,
                totalEarnings
        );
    }
}
