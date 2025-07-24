package com.galapass.api.tour.DTO.tourReview;

import com.galapass.api.user.DTO.user.ReviewerDTO;
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