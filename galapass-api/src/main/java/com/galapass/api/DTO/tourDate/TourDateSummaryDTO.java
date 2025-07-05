package com.galapass.api.DTO.tourDate;

import com.galapass.api.DTO.booking.BookingResponseSummaryDTO;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class TourDateSummaryDTO {
    private Long id;
    private Date date;
    private Double price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
}
