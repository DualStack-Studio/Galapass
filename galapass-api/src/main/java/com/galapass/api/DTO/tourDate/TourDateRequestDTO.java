package com.galapass.api.DTO.tourDate;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TourDateRequestDTO {
    private LocalDate date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
}
