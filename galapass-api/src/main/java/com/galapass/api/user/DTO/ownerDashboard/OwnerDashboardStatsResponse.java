package com.galapass.api.user.DTO.ownerDashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardStatsResponse {
    private long totalCompanies;
    private long totalTours;
    private long totalGuides;
    private BigDecimal totalRevenue;
}
