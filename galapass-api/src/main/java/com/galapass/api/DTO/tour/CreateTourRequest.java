package com.galapass.api.DTO.tour;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class CreateTourRequest {
    private String title;
    private String description;
    private Double price;
    private String category;
    private String location;
    private String photoUrl;
    private Long ownerId;
    private Long companyId;
    private List<Long> guideIds;
    private Set<String> tags;
}

