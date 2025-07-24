package com.galapass.api.DTO.tour;

import com.galapass.api.DTO.media.MediaResponse;
import com.galapass.api.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.DTO.user.GuideSummaryDTO;
import com.galapass.api.DTO.user.UserSummaryDTO;
import com.galapass.api.entity.CompanyTourStatus;
import com.galapass.api.entity.Location;
import com.galapass.api.entity.tour.Bring;
import com.galapass.api.entity.tour.Destination;
import com.galapass.api.entity.tour.Duration;
import com.galapass.api.entity.tour.TourCategory;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class TourResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private TourCategory category;
    private Location location;
    private Destination destination;
    private List<MediaResponse> media;
    private CompanyTourStatus status;
    private UserSummaryDTO owner;
    private TourCompanySummaryDTO company;
    private Set<GuideSummaryDTO> guides;
    private Set<String> tags;
    private double rating;
    private Duration duration;
    private Integer maxGuests;
    private List<String> highlights;
    private List<Bring> brings;
}
