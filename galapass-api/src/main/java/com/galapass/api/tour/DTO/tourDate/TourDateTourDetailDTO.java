package com.galapass.api.tour.DTO.tourDate;

import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class TourDateTourDetailDTO {
    private Long id;
    private ZonedDateTime date;
    private BigDecimal price;
    private boolean available;
    private Integer maxGuests;

    private int totalPeopleBooked;
    private List<GuideSummaryDTO> guides;
}
