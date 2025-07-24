package com.galapass.api.booking.DTO;

import com.galapass.api.booking.entity.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Set;

@Data
public class BookingRequestDTO {
    private Long tourDateId;
    private Set<Long> guideIds;
    private Set<Long> touristIds;
    private ZonedDateTime date;
    private int numberOfPeople;
    private BigDecimal totalPaid;
    private BookingStatus status;
}
