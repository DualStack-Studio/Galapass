package com.galapass.api.DTO.booking;

import com.galapass.api.entity.booking.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Date;
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
