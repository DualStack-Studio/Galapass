package com.galapass.api.DTO.tourReview;

import com.galapass.api.DTO.user.UserSummaryDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TourReviewResponse {
    private Long id;
    private double rating;
    private String comment;
    private UserSummaryDTO reviewer;
    private Long tourId;
}
