package com.galapass.api.tour.DTO.tourDate;

import com.galapass.api.tour.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;


@Data
@Builder
public class TourDateSummaryDTO {
    private Long id;
    private ZonedDateTime date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private TourResponseOwnerViewDTO tour;
    private List<GuideSummaryDTO> guides;
}
