package com.galapass.api.tour.DTO.tour;

import com.galapass.api.media.DTO.MediaRequest;
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
    private String destination;
    private List<MediaRequest> media;
    private Long ownerId;
    private Long companyId;
    private List<Long> guideIds;
    private Set<String> tags;
    private String duration;
    private Integer maxGuests;
    private List<String> highlights;
    private List<String> brings;
}

