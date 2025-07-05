package com.galapass.api.DTO.booking;

import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class BookingRequestDTO {
    private Long tourId;
    private Long tourDateId;
    private Set<Long> guideIds;
    private Set<Long> touristIds;
    private Date date;
    private int numberOfPeople;
    private Double totalPaid;
    private String status;
}
