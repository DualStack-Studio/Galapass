package com.galapass.api.service;

import com.galapass.api.DTO.ownerDashboard.OwnerDashboardStatsResponse;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.user.User;
import com.galapass.api.repository.BookingRepository;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OwnerDashboardService {

    private final TourCompanyRepository tourCompanyRepository;
    private final BookingRepository bookingRepository;

    public OwnerDashboardStatsResponse getOwnerDashboardStats(Long ownerId) {
        List<TourCompany> companies = tourCompanyRepository.findAllByOwner_Id(ownerId);

        long totalCompanies = companies.size();
        long totalTours = companies.stream()
                .mapToLong(c -> c.getTours().size())
                .sum();

        long totalGuides = companies.stream()
                .flatMap(c -> c.getGuides().stream())
                .map(User::getId) // Avoid counting duplicate guides across companies
                .distinct()
                .count();

        BigDecimal revenue = calculateRevenue(ownerId);

        return OwnerDashboardStatsResponse.builder()
                .totalCompanies(totalCompanies)
                .totalTours(totalTours)
                .totalGuides(totalGuides)
                .totalRevenue(revenue)
                .build();
    }

    public BigDecimal calculateRevenue(Long ownerId) {
        List<TourCompany> companies = tourCompanyRepository.findAllByOwner_Id(ownerId);

        // Get all tours from these companies
        List<Long> tourIds = companies.stream()
                .flatMap(company -> company.getTours().stream())
                .map(tour -> tour.getId())
                .toList();

        // Get all bookings related to these tours
        // Use BigDecimal for the variable to maintain precision
        BigDecimal totalRevenue = bookingRepository.findByTourDate_Tour_IdIn(tourIds).stream()
                // 1. Use .map() to keep the stream as BigDecimal objects
                .map(booking -> booking.getTotalPaid() != null ? booking.getTotalPaid() : BigDecimal.ZERO)
                // 2. Use .reduce() to safely sum up all the BigDecimal values
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalRevenue;
    }
}
