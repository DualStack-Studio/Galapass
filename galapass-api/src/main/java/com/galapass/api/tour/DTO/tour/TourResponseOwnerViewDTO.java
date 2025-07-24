package com.galapass.api.tour.DTO.tour;

import com.galapass.api.enums.entity.Location;
import com.galapass.api.media.DTO.MediaResponse;
import com.galapass.api.tour.entity.Destination;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourResponseOwnerViewDTO {
    private Long id;
    private String title;
    private Location location;
    private Destination destination;
    private Double price;
    private List<MediaResponse> media;

    private UserSummaryDTO owner;
    private Double rating;
    private long reviewCount;
    private String status;
}
