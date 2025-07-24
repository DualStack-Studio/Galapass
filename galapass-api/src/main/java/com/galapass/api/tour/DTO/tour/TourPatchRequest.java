package com.galapass.api.tour.DTO.tour;

import com.galapass.api.media.DTO.MediaRequest;
import com.galapass.api.tour.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class TourPatchRequest {
    private String title;
    private String description;
    private Double price;
    private String category;
    private String location;
    private List<MediaRequest> media;
    private String status;

    private UserSummaryDTO owner;
    private TourCompanySummaryDTO company;
    private Set<GuideSummaryDTO> guides;

    private Set<String> tags;
    private double rating;

    private String duration;
    private Integer maxGuests;
    private List<String> highlights;
    private List<String> brings;
}
