package com.galapass.api.tour.DTO.tour;

import com.galapass.api.enums.entity.Location;
import com.galapass.api.media.DTO.MediaResponse;
import com.galapass.api.tour.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.tour.entity.*;
import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
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
