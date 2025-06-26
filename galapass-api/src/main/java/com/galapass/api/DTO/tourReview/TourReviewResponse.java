package com.galapass.api.DTO.tourReview;

import com.galapass.api.DTO.user.OwnerSummaryDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TourReviewResponse {
    private Long id;
    private double rating;
    private String comment;
    private OwnerSummaryDTO reviewer;
    private Long tourId;
}
