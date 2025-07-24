package com.galapass.api.booking.DTO;

import com.galapass.api.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseSummaryDTO {
    private Long id;
    private ZonedDateTime date;
    private int numberOfPeople;
    private BigDecimal totalPaid;
    private BookingStatus status;
}
