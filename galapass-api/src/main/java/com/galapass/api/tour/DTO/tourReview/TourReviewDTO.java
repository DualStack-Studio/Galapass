package com.galapass.api.DTO.tourReview;

import com.galapass.api.DTO.user.ReviewerDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TourReviewDTO {
    private Long id;
    private double rating;
    private String comment;

    private ReviewerDTO reviewer;
}