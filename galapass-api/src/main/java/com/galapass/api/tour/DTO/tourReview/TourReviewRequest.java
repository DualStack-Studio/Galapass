package com.galapass.api.tour.DTO.tourReview;

import lombok.Data;

@Data
public class TourReviewRequest {
    private Long bookingId;
    private Long tourId;
    private Long reviewerId;
    private double rating;
    private String comment;
}
