package com.galapass.api.service;

import com.galapass.api.DTO.booking.BookingStatsDTO;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus; // Import the enum
import com.galapass.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingStatsService {

    private final BookingRepository bookingRepository;

    public BookingStatsDTO getBookingStats(Long ownerId) {
        List<Booking> allBookings = bookingRepository.findByTourDate_Tour_Owner_Id(ownerId);

        // --- CORRECTED FILTER ---
        List<Booking> confirmedBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .toList();

        long totalBookings = confirmedBookings.size();

        BigDecimal totalRevenue = confirmedBookings.stream()
                .map(Booking::getTotalPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long upcomingBookings = confirmedBookings.stream()
                .filter(b -> !b.getTourDate().getDate().isBefore(ZonedDateTime.now()))
                .count();

        BigDecimal averageBookingValue = totalBookings > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalBookings), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return BookingStatsDTO.builder()
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .upcomingBookings(upcomingBookings)
                .averageBookingValue(averageBookingValue)
                .build();
    }
}