package com.galapass.api.DTO.tour;

import com.galapass.api.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.DTO.user.GuideSummaryDTO;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import com.galapass.api.entity.CompanyTourStatus;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class TourResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String location;
    private List<String> photoUrls;
    private CompanyTourStatus status;

    private OwnerSummaryDTO owner;
    private TourCompanySummaryDTO company;
    private Set<GuideSummaryDTO> guides;

    private Set<String> tags;
    private double rating;

    private String duration;
    private Integer maxGuests;
    private List<String> highlights;
}
