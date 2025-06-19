package com.galapass.api.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Booking booking;

    @ManyToOne
    private User guide;

    @ManyToOne
    private User reviewer;

    private int rating;
    private String comment;

    @PrePersist
    @PreUpdate
    private void validateGuideReview() {
        if (!booking.getTour().getGuides().contains(guide)) {
            throw new IllegalStateException("The guide being reviewed was not assigned to the tour in this booking.");
        }

        if (!booking.getTourists().contains(reviewer)) {
            throw new IllegalStateException("The reviewer was not a tourist in this booking.");
        }
    }
}