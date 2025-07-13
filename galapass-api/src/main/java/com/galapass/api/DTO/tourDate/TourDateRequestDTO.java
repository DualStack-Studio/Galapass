package com.galapass.api.DTO.tourDate;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

@Data
public class TourDateRequestDTO {
    private ZonedDateTime date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
}
