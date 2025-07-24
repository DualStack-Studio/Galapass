package com.galapass.api.DTO.guideReview;

import com.galapass.api.DTO.user.UserSummaryDTO;
import lombok.Data;

@Data
public class GuideReviewResponseDTO {
    private Long id;
    private double rating;
    private String comment;

    private UserSummaryDTO reviewer;
    private UserSummaryDTO guide;
    private Long bookingId;
}
