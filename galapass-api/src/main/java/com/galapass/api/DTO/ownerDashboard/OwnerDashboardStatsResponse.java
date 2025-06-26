package com.galapass.api.DTO.ownerDashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardStatsResponse {
    private long totalCompanies;
    private long totalTours;
    private long totalGuides;
    private double totalRevenue;
}
