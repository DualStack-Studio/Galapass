package com.galapass.api.entity.booking;
import com.galapass.api.entity.TourDate;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "booking_tourists",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "tourist_id")
    )
    private Set<User> tourists = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;

    @ManyToMany
    @JoinTable(
            name = "booking_guides",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "guide_id")
    )
    private Set<User> guides = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "tour_date_id", nullable = false)
    private TourDate tourDate;

    private Date date;
    private int numberOfPeople;
    private Double totalPaid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;
}