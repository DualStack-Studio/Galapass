package com.galapass.api.DTO.tour;

import com.galapass.api.entity.Location;
import com.galapass.api.entity.tour.Destination;
import com.galapass.api.entity.tour.TourCategory;
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
