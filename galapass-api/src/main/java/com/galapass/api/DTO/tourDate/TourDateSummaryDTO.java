package com.galapass.api.DTO.tourDate;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;



@Data
@Builder
public class TourDateSummaryDTO {
    private Long id;
    private LocalDate date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
}
