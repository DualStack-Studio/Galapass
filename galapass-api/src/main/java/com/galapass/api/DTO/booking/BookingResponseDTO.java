package com.galapass.api.DTO.booking;

import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import com.galapass.api.entity.booking.BookingStatus;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class BookingResponseDTO {
    private Long id;
    private Set<OwnerSummaryDTO> tourists;
    private TourResponseOwnerViewDTO tour;
    private Date date;
    private int numberOfPeople;
    private Double totalPaid;
    private BookingStatus status;
}
