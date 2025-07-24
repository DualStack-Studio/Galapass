package com.galapass.api.tour.entity;

import com.galapass.api.booking.entity.Booking;
import com.galapass.api.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;

    @ManyToOne
    private User reviewer;

    private double rating;
    private String comment;

    @PrePersist
    @PreUpdate
    private void validateReviewerIsTourist() {
        if (booking != null && !booking.getTourists().contains(reviewer)) {
            throw new IllegalStateException("Reviewer must be a tourist in the booking.");
        }
    }
}