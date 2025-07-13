package com.galapass.api.DTO.tourDate;

import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;


@Data
@Builder
public class TourDateSummaryDTO {
    private Long id;
    private ZonedDateTime date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private TourResponseOwnerViewDTO tour;
}
