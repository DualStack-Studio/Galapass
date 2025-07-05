package com.galapass.api.mapper;

import com.galapass.api.DTO.user.GuideSummaryDTO;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import com.galapass.api.entity.tour.TourStatus;
import com.galapass.api.entity.user.User;
import com.galapass.api.repository.GuideReviewRepository;
import com.galapass.api.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final GuideReviewRepository guideReviewRepository;
    private final TourRepository tourRepository;

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    public OwnerSummaryDTO toOwnerSummaryDTO(User user) {
        if (user == null) {
            return null;
        }
        OwnerSummaryDTO dto = new OwnerSummaryDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setProfilePhoto(user.getProfilePhoto());
        return dto;
    }

    public GuideSummaryDTO toGuideSummaryDTO(User user) {
        if (user == null) {
            return null;
        }
        GuideSummaryDTO dto = new GuideSummaryDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setProfilePhoto(user.getProfilePhoto());
        dto.setStatus(String.valueOf(user.getStatus()));
        dto.setRating(guideReviewRepository.getAverageRatingByGuideId(user.getId()) != null
                ? guideReviewRepository.getAverageRatingByGuideId(user.getId())
                : 0.0);
        dto.setActiveTours(
                tourRepository.countToursByGuideIdAndStatus(user.getId(), TourStatus.ACTIVE) != null ?
                        tourRepository.countToursByGuideIdAndStatus(user.getId(), TourStatus.ACTIVE) : 0
        );
        return dto;
    }
}
