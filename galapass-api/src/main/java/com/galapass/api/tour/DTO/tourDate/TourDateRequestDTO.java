package com.galapass.api.tour.DTO.tourDate;

import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class TourDateRequestDTO {
    private ZonedDateTime date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
    private List<Long> guideIds;
}
