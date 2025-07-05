package com.galapass.api.entity;

import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.tour.Tour;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date date;

    private Double price;

    private boolean available;

    private Integer maxGuests;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @OneToMany(mappedBy = "tourDate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();
}
