package com.galapass.api.tour.entity;

import com.galapass.api.booking.entity.Booking;
import com.galapass.api.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ZonedDateTime date;

    private BigDecimal price;

    private boolean available;

    private Integer maxGuests;

    @ManyToMany
    @JoinTable(
            name = "tour_guide",
            joinColumns = @JoinColumn(name = "tourDate_id"),
            inverseJoinColumns = @JoinColumn(name = "guide_id")
    )
    private Set<User> guides = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;


    @OneToMany(mappedBy = "tourDate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();
}
