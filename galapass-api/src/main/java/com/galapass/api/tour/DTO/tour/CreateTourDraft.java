package com.galapass.api.tour.DTO.tour;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateTourDraft {
    private Long id;
    private Long ownerId;
    private String title;
    private String category;
    private String location;
    private String destination;
}
