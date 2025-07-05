package com.galapass.api.controller;

import com.galapass.api.DTO.guideInvitation.GuideInvitationResponse;
import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.DTO.tourCompany.TourCompanyBasicDTO;
import com.galapass.api.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.tour.TourStatus;
import com.galapass.api.entity.user.User;
import com.galapass.api.mapper.GuideInvitationMapper;
import com.galapass.api.mapper.TourMapper;
import com.galapass.api.service.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/guides")
@RequiredArgsConstructor
@Tag(name = "Guide API", description = "Guide API")
public class GuideController {

    private final UserService userService;
    private final BookingService bookingService;
    private final TourMapper tourMapper;
    private final GuideInvitationService guideInvitationService;
    private final GuideInvitationMapper guideInvitationMapper;
    private final TourCompanyService tourCompanyService;

    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/companies")
    public ResponseEntity<List<TourCompanyResponse>> getCompaniesByGuide(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourCompanyService.getCompaniesByOwnerId(guideId));
    }

    // Active tours from bookings with ACTIVE or CONFIRMED status, or filter accordingly
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/active")
    public ResponseEntity<List<TourResponseDTO>> getActiveToursByGuide(@PathVariable Long guideId) {
        var bookings = bookingService.getBookingsByGuideAndStatus(guideId, BookingStatus.CONFIRMED);
        var tours = bookings.stream()
                .map(Booking::getTour)
                .distinct()
                .toList();

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    // Completed tours from bookings with COMPLETED status
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/completed")
    public ResponseEntity<List<TourResponseDTO>> getCompletedToursByGuide(@PathVariable Long guideId) {
        var bookings = bookingService.getBookingsByGuideAndStatus(guideId, BookingStatus.COMPLETED);
        var tours = bookings.stream()
                .map(Booking::getTour)
                .distinct()
                .toList();

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    // Upcoming tours by bookings with date in future and status CONFIRMED or PENDING
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/upcoming")
    public ResponseEntity<List<TourResponseDTO>> getUpcomingToursByGuide(@PathVariable Long guideId) {
        var bookings = bookingService.getUpcomingBookingsByGuide(guideId);
        var tours = bookings.stream()
                .map(Booking::getTour)
                .distinct()
                .toList();

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    // Tour history by all bookings (any status) ordered by date descending
    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/{guideId}/tours/history")
    public ResponseEntity<List<TourResponseDTO>> getTourHistoryByGuide(@PathVariable Long guideId) {
        var bookings = bookingService.getBookingHistoryByGuide(guideId);
        var tours = bookings.stream()
                .map(Booking::getTour)
                .distinct()
                .toList();

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

}
