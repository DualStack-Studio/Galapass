package com.galapass.api.DTO.tour;

import com.galapass.api.DTO.media.MediaResponse;
import com.galapass.api.DTO.user.UserSummaryDTO;
import com.galapass.api.entity.Location;
import com.galapass.api.entity.tour.Destination;
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
