package com.galapass.api.user.mapper;

import com.galapass.api.user.DTO.guideReview.GuideReviewResponseDTO;
import com.galapass.api.user.entity.GuideReview;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GuideReviewMapper {

    private final UserMapper userMapper;

    public GuideReviewResponseDTO toGuideReviewResponseDTO(GuideReview review) {
        GuideReviewResponseDTO dto = new GuideReviewResponseDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewer(userMapper.toOwnerSummaryDTO(review.getReviewer()));
        dto.setGuide(userMapper.toOwnerSummaryDTO(review.getGuide()));
        dto.setBookingId(review.getBooking().getId());
        return dto;
    }
}
