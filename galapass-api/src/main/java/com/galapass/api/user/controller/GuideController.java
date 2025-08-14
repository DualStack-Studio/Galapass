package com.galapass.api.user.controller;

import com.galapass.api.booking.DTO.BookingResponseDTO;
import com.galapass.api.booking.entity.Booking;
import com.galapass.api.booking.entity.BookingStatus;
import com.galapass.api.booking.service.BookingService;
import com.galapass.api.tour.DTO.tour.TourResponseDTO;
import com.galapass.api.tour.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.tour.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.tour.entity.Tour;
import com.galapass.api.tour.mapper.TourMapper;
import com.galapass.api.tour.service.TourCompanyService;
import com.galapass.api.user.DTO.guideDashboard.GuideDashboardStatsDTO;
import com.galapass.api.user.DTO.guideInvitation.GuideInvitationResponse;
import com.galapass.api.user.entity.GuideInvitation;
import com.galapass.api.user.mapper.GuideInvitationMapper;
import com.galapass.api.user.service.GuideDashboardStatsService;
import com.galapass.api.user.service.GuideInvitationService;
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
    private final GuideInvitationService guideInvitationService;
    private final GuideInvitationMapper guideInvitationMapper;
    private final GuideDashboardStatsService guideDashboardStatsService;

    @PreAuthorize("hasAuthority('GUIDE')")
    @GetMapping("/{guideId}/companies")
    public ResponseEntity<List<TourCompanyResponse>> getCompaniesByGuide(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourCompanyService.getCompaniesByGuideId(guideId));
    }

    // Active tours from bookings with CONFIRMED status
    @PreAuthorize("hasAuthority('GUIDE')")
    @GetMapping("/{guideId}/tours/active")
    public ResponseEntity<List<TourResponseOwnerViewDTO>> getActiveToursByGuide(@PathVariable Long guideId) {
        List<Booking> bookings = bookingService.getBookingsByGuideAndStatus(guideId, BookingStatus.CONFIRMED);

        List<Tour> tours = bookings.stream()
                .map(booking -> booking.getTourDate().getTour())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(tourMapper.toTourResponseOwnerViewDTOList(tours));

    }
    @PreAuthorize("hasAuthority('GUIDE')")
    @GetMapping("/{guideId}/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByGuide(@PathVariable Long guideId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByGuide(guideId);
        return ResponseEntity.ok(bookings);
    }

    // Completed tours from bookings with COMPLETED status
    @PreAuthorize("hasAuthority('GUIDE')")
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
    @PreAuthorize("hasAuthority('GUIDE')")
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
    @PreAuthorize("hasAuthority('GUIDE')")
    @GetMapping("/{guideId}/tours/history")
    public ResponseEntity<List<TourResponseDTO>> getTourHistoryByGuide(@PathVariable Long guideId) {
        List<Booking> bookings = bookingService.getBookingHistoryByGuide(guideId);

        List<Tour> tours = bookings.stream()
                .map(booking -> booking.getTourDate().getTour())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    @GetMapping("/{guideId}/dashboard-stats")
    public ResponseEntity<GuideDashboardStatsDTO> getDashboardStats(@PathVariable Long guideId) {
        GuideDashboardStatsDTO stats = bookingService.getDashboardStatsForGuide(guideId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{guideId}/invitations")
    public ResponseEntity<List<GuideInvitationResponse>> getInvitationsByGuide(@PathVariable Long guideId) {
        List<GuideInvitation> invitations = guideInvitationService.getInvitationsByGuideId(guideId);

        List<GuideInvitationResponse> response = invitations.stream()
                .map(guideInvitationMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('GUIDE')")
    @PatchMapping("/{guideId}/dashboard-stats")
    public ResponseEntity<GuideDashboardStatsDTO> patchDashboardStats(
            @PathVariable Long guideId,
            @RequestBody GuideDashboardStatsDTO partialStats) {
        return ResponseEntity.ok(guideDashboardStatsService.patchStats(guideId, partialStats));
    }




}