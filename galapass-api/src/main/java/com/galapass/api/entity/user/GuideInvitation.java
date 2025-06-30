package com.galapass.api.entity.user;

import com.galapass.api.entity.InvitationStatus;
import com.galapass.api.entity.TourCompany;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    private LocalDateTime sentAt;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private TourCompany company;

    @ManyToOne
    @JoinColumn(name = "guide_id", nullable = false)
    private User guide;
}

