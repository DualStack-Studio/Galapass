package com.galapass.api.user.DTO.guideReview;

import lombok.Data;

@Data
public class GuideReviewRequestDTO {
    private Long bookingId;
    private Long guideId;
    private Long reviewerId;
    private double rating;
    private String comment;
}
