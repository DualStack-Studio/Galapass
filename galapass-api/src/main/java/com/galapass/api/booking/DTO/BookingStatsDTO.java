package com.galapass.api.booking.DTO;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class BookingStatsDTO {
    private long totalBookings;
    private long upcomingBookings;
    private BigDecimal totalRevenue;
    private BigDecimal averageBookingValue;
}
