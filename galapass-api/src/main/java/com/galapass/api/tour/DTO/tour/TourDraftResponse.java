package com.galapass.api.tour.DTO.tour;

import com.galapass.api.enums.entity.Location;
import com.galapass.api.tour.entity.Destination;
import com.galapass.api.tour.entity.TourCategory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TourDraftResponse {
    private Long id;
    private String title;
    private TourCategory category;
    private Location location;
    private Destination destination;
}
