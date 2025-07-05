package com.galapass.api.controller;

import com.galapass.api.DTO.booking.BookingRequestDTO;
import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking API", description = "Booking API")
public class BookingController {

    private final BookingService bookingService;

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

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(bookingService.getBookingsByOwner(ownerId));
    }

    @GetMapping("/owner/{ownerId}/search")
    public ResponseEntity<List<BookingResponseDTO>> searchBookingsByOwner(
            @PathVariable Long ownerId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(bookingService.searchBookingsByOwner(ownerId, status, date, search));
    }
}

