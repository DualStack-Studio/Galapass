package com.galapass.api.controller;

import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.mapper.TourMapper;
import com.galapass.api.service.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guides")
@RequiredArgsConstructor
@Tag(name = "Guide API", description = "Guide API")
public class GuideController {

    private final BookingService bookingService;
    private final TourMapper tourMapper;
    private final TourCompanyService tourCompanyService;

    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/companies")
    public ResponseEntity<List<TourCompanyResponse>> getCompaniesByGuide(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourCompanyService.getCompaniesByOwnerId(guideId));
    }

    // Active tours from bookings with CONFIRMED status
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/active")
    public ResponseEntity<List<TourResponseDTO>> getActiveToursByGuide(@PathVariable Long guideId) {
        List<Booking> bookings = bookingService.getBookingsByGuideAndStatus(guideId, BookingStatus.CONFIRMED);

        List<Tour> tours = bookings.stream()
                .map(booking -> booking.getTourDate().getTour())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    // Completed tours from bookings with COMPLETED status
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/completed")
    public ResponseEntity<List<TourResponseDTO>> getCompletedToursByGuide(@PathVariable Long guideId) {
        List<Booking> bookings = bookingService.getBookingsByGuideAndStatus(guideId, BookingStatus.COMPLETED);

        List<Tour> tours = bookings.stream()
                .map(booking -> booking.getTourDate().getTour())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    // Upcoming tours by bookings with date in future and status CONFIRMED
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/upcoming")
    public ResponseEntity<List<TourResponseDTO>> getUpcomingToursByGuide(@PathVariable Long guideId) {
        List<Booking> bookings = bookingService.getUpcomingBookingsByGuide(guideId);

        List<Tour> tours = bookings.stream()
                .map(booking -> booking.getTourDate().getTour())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    // Tour history by all bookings (any status) ordered by date descending
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/history")
    public ResponseEntity<List<TourResponseDTO>> getTourHistoryByGuide(@PathVariable Long guideId) {
        List<Booking> bookings = bookingService.getBookingHistoryByGuide(guideId);

        List<Tour> tours = bookings.stream()
                .map(booking -> booking.getTourDate().getTour())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }
}