package com.galapass.api.tour.mapper;

import com.galapass.api.tour.DTO.tourReview.TourReviewDTO;
import com.galapass.api.tour.DTO.tourReview.TourReviewResponse;
import com.galapass.api.tour.entity.TourReview;
import com.galapass.api.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TourReviewMapper {

    private final UserMapper userMapper;

    public TourReviewResponse toReviewResponse(TourReview review) {
        return TourReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewer(userMapper.toOwnerSummaryDTO(review.getReviewer()))
                .tourId(review.getTour().getId())
                .build();
    }

    public TourReviewDTO toTourReview(TourReview review) {
        return TourReviewDTO.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewer(userMapper.toReviewerDTO(review.getReviewer()))
                .build();
    }
}
