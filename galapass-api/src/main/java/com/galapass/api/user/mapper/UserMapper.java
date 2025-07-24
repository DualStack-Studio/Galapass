package com.galapass.api.user.mapper;

import com.galapass.api.tour.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.tour.entity.CompanyTourStatus;
import com.galapass.api.tour.entity.TourCompany;
import com.galapass.api.tour.repository.TourRepository;
import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import com.galapass.api.user.DTO.user.ReviewerDTO;
import com.galapass.api.user.DTO.user.UserResponse;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
import com.galapass.api.user.DTO.user.UserCompaniesDTO;
import com.galapass.api.user.entity.User;
import com.galapass.api.user.repository.GuideReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final GuideReviewRepository guideReviewRepository;
    private final TourRepository tourRepository;


    public UserCompaniesDTO toUserCompaniesDTO(User user) {
        return UserCompaniesDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .bio(user.getBio())
                .language(user.getLanguage())
                .companies(user.getCompanies().stream()
                        .map(this::toTourCompanySummaryDTO)
                        .collect(Collectors.toSet()))
                .build();
    }

    private TourCompanySummaryDTO toTourCompanySummaryDTO(TourCompany company) {
        return TourCompanySummaryDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .build();
    }
    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    public UserSummaryDTO toOwnerSummaryDTO(User user) {
        if (user == null) {
            return null;
        }
        UserSummaryDTO dto = new UserSummaryDTO();
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
                tourRepository.countToursByGuideIdAndStatus(user.getId(), CompanyTourStatus.ACTIVE) != null ?
                        tourRepository.countToursByGuideIdAndStatus(user.getId(), CompanyTourStatus.ACTIVE) : 0
        );
        return dto;
    }

    public ReviewerDTO toReviewerDTO(User user) {
        return ReviewerDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .profilePictureUrl(user.getProfilePhoto())
                .build();
    }
}
