package com.galapass.api.DTO;

import lombok.Data;

import java.util.List;

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
}

