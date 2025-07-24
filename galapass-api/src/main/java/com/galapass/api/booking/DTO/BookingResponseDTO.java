package com.galapass.api.DTO.booking;

import com.galapass.api.DTO.tourDate.TourDateSummaryDTO;
import com.galapass.api.DTO.user.UserSummaryDTO;
import com.galapass.api.entity.booking.BookingStatus;
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
