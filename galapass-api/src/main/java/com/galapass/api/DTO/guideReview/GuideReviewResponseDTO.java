package com.galapass.api.DTO.guideReview;

import com.galapass.api.DTO.user.OwnerSummaryDTO;
import lombok.Data;

@Data
public class GuideReviewResponseDTO {
    private Long id;
    private double rating;
    private String comment;

    private OwnerSummaryDTO reviewer;
    private OwnerSummaryDTO guide;
    private Long bookingId;
}
