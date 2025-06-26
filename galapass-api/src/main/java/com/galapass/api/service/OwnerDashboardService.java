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

        double revenue = calculateRevenue(ownerId);

        return OwnerDashboardStatsResponse.builder()
                .totalCompanies(totalCompanies)
                .totalTours(totalTours)
                .totalGuides(totalGuides)
                .totalRevenue(revenue)
                .build();
    }

    public double calculateRevenue(Long ownerId) {
        List<TourCompany> companies = tourCompanyRepository.findAllByOwner_Id(ownerId);

        // Get all tours from these companies
        List<Long> tourIds = companies.stream()
                .flatMap(company -> company.getTours().stream())
                .map(tour -> tour.getId())
                .toList();

        // Get all bookings related to these tours
        double totalRevenue = bookingRepository.findByTourIdIn(tourIds).stream()
                .mapToDouble(booking -> booking.getTotalPaid() != null ? booking.getTotalPaid() : 0.0)
                .sum();

        return totalRevenue;
    }
}
