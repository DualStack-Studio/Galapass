package com.galapass.api.entity;
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
    private User reviewer;

    private int rating;
    private String comment;

    @PrePersist
    @PreUpdate
    private void validateReviewerIsTourist() {
        if (booking != null && !booking.getTourists().contains(reviewer)) {
            throw new IllegalStateException("Reviewer must be a tourist in the booking.");
        }
    }
}