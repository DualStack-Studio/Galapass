package com.galapass.api.controller;

import com.galapass.api.DTO.booking.BookingRequestDTO;
import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.DTO.booking.BookingStatsDTO;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.user.User;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.service.BookingService;
import com.galapass.api.service.BookingStatsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking API", description = "Booking API")
public class BookingController {

    private final BookingService bookingService;
    private final BookingStatsService statsService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody BookingRequestDTO request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping
    public ResponseEntity<Booking> updateBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.updateBooking(booking));
    }

    @DeleteMapping("/{id}")
    public void deleteBookingById(@PathVariable Long id) {
        bookingService.deleteBookingById(id);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByOwner(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getBookingsByOwner(user.getId()));
    }

    @GetMapping("/owner/search")
    public ResponseEntity<List<BookingResponseDTO>> searchBookingsByOwner(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(bookingService.searchBookingsByOwner(user.getId(), status, date, search));
    }

    @GetMapping("/owner/stats")
    public ResponseEntity<BookingStatsDTO> getBookingStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statsService.getBookingStats(user.getId()));
    }

    @PostMapping("/{id}/status/{status}")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @PathVariable BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
}
