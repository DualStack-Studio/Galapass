package com.galapass.api.user.DTO.guideDashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class GuideDashboardStatsDTO {
    private long activeToursCount;
    private long upcomingToursCount;
    private long completedToursCount;
    private double averageRating;
    private BigDecimal totalEarnings;
}
