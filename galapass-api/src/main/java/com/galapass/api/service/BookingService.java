package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.booking.BookingRequestDTO;
import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.user.User;
import com.galapass.api.mapper.BookingMapper;
import com.galapass.api.repository.BookingRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;
    private final BookingMapper bookingMapper;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + request.getTourId()));

        Set<User> tourists = userRepository.findAllById(request.getTouristIds())
                .stream().collect(Collectors.toSet());

        Booking booking = Booking.builder()
                .tour(tour)
                .tourists(tourists)
                .date(request.getDate())
                .numberOfPeople(request.getNumberOfPeople())
                .totalPaid(request.getTotalPaid())
                .status(BookingStatus.PENDING)
                .build();


        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toBookingResponseDTO(saved);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking updateBooking(Booking bookingUpdate) {
        return bookingRepository.findById(bookingUpdate.getId())
                .map(existing -> {
                    try {
                        objectMapper.updateValue(existing, bookingUpdate);
                        return bookingRepository.save(existing);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update booking", e);
                    }
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingUpdate.getId()));
    }

    public void deleteBookingById(Long id) {
        bookingRepository.deleteById(id);
    }

    public long getTotalBookingsForTour(Long tourId) {
        return bookingRepository.countBookingsByTourId(tourId);
    }

    // NEW: Status transitions

    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByGuideAndStatus(Long guideId, BookingStatus status) {
        // Assuming you have a method in BookingRepository that finds bookings by guide (tour guides in tour) and booking status
        return bookingRepository.findBookingsByGuideIdAndStatus(guideId, status);
    }

    public List<Booking> getUpcomingBookingsByGuide(Long guideId) {
        List<BookingStatus> statuses = List.of(BookingStatus.CONFIRMED, BookingStatus.PENDING);
        return bookingRepository.findUpcomingBookingsByGuideId(guideId, statuses);
    }

    public List<Booking> getBookingHistoryByGuide(Long guideId) {
        // all bookings with guideId, ordered by date desc
        return bookingRepository.findBookingHistoryByGuideId(guideId);
    }


}
