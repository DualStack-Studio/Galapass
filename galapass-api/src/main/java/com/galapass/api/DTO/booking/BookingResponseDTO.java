package com.galapass.api.DTO.booking;

import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.DTO.tourDate.TourDateSummaryDTO;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import com.galapass.api.entity.booking.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Data
public class BookingResponseDTO {
    private Long id;
    private TourDateSummaryDTO tourDate;
    private Set<OwnerSummaryDTO> guides;
    private Set<OwnerSummaryDTO> tourists;
    private LocalDate date;
    private int numberOfPeople;
    private BigDecimal totalPaid;
    private BookingStatus status;
}
