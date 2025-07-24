package com.galapass.api.entity;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Booking booking;

    @ManyToOne
    private User guide;

    @ManyToOne
    private User sender;

    private Double amount;
    private String comment;

    @PrePersist
    @PreUpdate
    private void validateTip() {
        if (!booking.getTourDate().getTour().getGuides().contains(guide)) {
            throw new IllegalStateException("The guide was not assigned to the tour in this booking.");
        }

        if (!booking.getTourists().contains(sender)) {
            throw new IllegalStateException("The sender was not a tourist in this booking.");
        }
    }
}