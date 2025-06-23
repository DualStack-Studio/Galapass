package com.galapass.api.DTO;

import lombok.Data;
import java.util.Set;

@Data
public class TourResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String location;
    private String photoUrl;

    private UserSummaryDTO owner;
    private CompanySummaryDTO company;
    private Set<UserSummaryDTO> guides;
}