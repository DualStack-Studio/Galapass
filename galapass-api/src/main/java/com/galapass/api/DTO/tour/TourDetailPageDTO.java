package com.galapass.api.DTO.tour;

import com.galapass.api.DTO.media.MediaResponse;
import com.galapass.api.DTO.tourCompany.TourCompanyTourDetailDTO;
import com.galapass.api.DTO.tourDate.TourDateTourDetailDTO;
import com.galapass.api.DTO.tourReview.TourReviewDTO;
import com.galapass.api.DTO.user.GuideSummaryDTO;
import com.galapass.api.DTO.user.UserSummaryDTO;
import com.galapass.api.entity.Location;
import com.galapass.api.entity.tour.Destination;
import com.galapass.api.entity.tour.Duration;
import com.galapass.api.entity.tour.TourCategory;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Builder
public class TourDetailPageDTO {
    private Long id;
    private String title;
    private String description;
    private TourCompanyTourDetailDTO company;
    private Duration duration;
    private Integer maxGuests;
    private Double price;
    private Location location;
    private Destination destination;
    private List<MediaResponse> media;
    private Set<String> tags;
    private Set<GuideSummaryDTO> guides;
    private TourCategory category;
    private List<String> highlights;
    private UserSummaryDTO owner;
    private Double averageRating;
    private Long totalReviews;

    private List<TourReviewDTO> reviews;
    private List<TourDateTourDetailDTO> tourDates;
}
