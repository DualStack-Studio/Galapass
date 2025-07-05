package com.galapass.api.DTO.booking;

import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.Set;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseSummaryDTO {
    private Long id;
    private LocalDate date;
    private int numberOfPeople;
    private BigDecimal totalPaid;
    private String status;
}
