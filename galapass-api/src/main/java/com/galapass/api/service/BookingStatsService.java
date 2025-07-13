package com.galapass.api.service;

import com.galapass.api.DTO.booking.BookingStatsDTO;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingStatsService {

    private final BookingRepository bookingRepository;

    public BookingStatsDTO getBookingStats(Long ownerId) {
        // Fetch all bookings for a given owner
        List<Booking> allBookings = bookingRepository.findByTourDate_Tour_Owner_Id(ownerId);

        // Filter for confirmed bookings to calculate revenue and totals
        // Note: Adjust the status check based on your BookingStatus enum or logic
        List<Booking> confirmedBookings = allBookings.stream()
                .filter(b -> Objects.equals(b.getStatus(), "CONFIRMED"))
                .collect(Collectors.toList());

        long totalBookings = confirmedBookings.size();

        // Calculate total revenue from confirmed bookings
        BigDecimal totalRevenue = confirmedBookings.stream()
                .map(Booking::getTotalPaid) // Assumes getTotalPaid() returns BigDecimal
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate upcoming bookings from today onwards
        long upcomingBookings = confirmedBookings.stream()
                .filter(b -> !b.getTourDate().getDate().isBefore(ZonedDateTime.now()))
                .count();

        // Calculate average booking value, handling division by zero
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