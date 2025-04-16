package com.galapass.api.entity;
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

    @ManyToOne
    private User tourist;

    @ManyToOne
    private Tour tour;

    private Date date;
    private int numberOfPeople;
    private Double totalPaid;
    private boolean completed;
}