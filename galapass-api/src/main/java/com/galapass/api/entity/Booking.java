package com.galapass.api.entity;
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

    private Date date;
    private int numberOfPeople;
    private Double totalPaid;
    private boolean completed;
}