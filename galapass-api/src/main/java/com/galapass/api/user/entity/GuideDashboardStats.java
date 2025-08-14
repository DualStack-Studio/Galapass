package com.galapass.api.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "guide_dashboard_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideDashboardStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long activeToursCount;
    private long upcomingToursCount;
    private long completedToursCount;
    private double averageRating;
    private BigDecimal totalEarnings;

    @OneToOne
    @JoinColumn(name = "guide_id", nullable = false, unique = true)
    private User guide;
}
