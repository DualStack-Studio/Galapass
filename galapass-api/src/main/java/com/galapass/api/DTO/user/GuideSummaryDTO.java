package com.galapass.api.DTO.user;

import lombok.Data;

@Data
public class GuideSummaryDTO {
    private Long id;
    private String email;
    private String name;
    private String profilePhoto;
    private String status;
    private double rating;
    private long activeTours;
}
