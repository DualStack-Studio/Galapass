package com.galapass.api.DTO.tourDate;

import lombok.Data;
import java.util.Date;

@Data
public class TourDateRequestDTO {
    private Date date;
    private Double price;
    private boolean available;
    private Integer maxGuests;
    private Long tourId;
}
