package com.galapass.api.booking.DTO;

import com.galapass.api.booking.entity.BookingStatus;
import com.galapass.api.tour.DTO.tourDate.TourDateSummaryDTO;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Set;

@Data
public class BookingResponseDTO {
    private Long id;
    private TourDateSummaryDTO tourDate;
    private Set<UserSummaryDTO> guides;
    private Set<UserSummaryDTO> tourists;
    private ZonedDateTime date;
    private int numberOfPeople;
    private BigDecimal totalPaid;
    private BookingStatus status;
}
