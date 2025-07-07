package com.galapass.api.DTO.tourDate;

import com.galapass.api.DTO.booking.BookingResponseSummaryDTO;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
public class TourDateResponseDTO {
    private Long id;
    private ZonedDateTime date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
    private List<BookingResponseSummaryDTO> bookings;
}