package com.galapass.api.DTO.booking;

import com.galapass.api.entity.booking.BookingStatus;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class BookingRequestDTO {
    private Long tourId;
    private Set<Long> touristIds;
    private Date date;
    private int numberOfPeople;
    private Double totalPaid;
    private BookingStatus status;
}
