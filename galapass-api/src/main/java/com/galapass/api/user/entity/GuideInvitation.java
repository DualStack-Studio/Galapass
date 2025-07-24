package com.galapass.api.user.entity;

import com.galapass.api.tour.entity.TourCompany;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status = InvitationStatus.PENDING;

    private ZonedDateTime sentAt;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private TourCompany company;

    @ManyToOne
    @JoinColumn(name = "guide_id", nullable = false)
    private User guide;
}

