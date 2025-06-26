package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.galapass.api.DTO.booking.BookingRequestDTO;
import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.entity.Booking;
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
                .completed(request.isCompleted())
                .build();

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toBookingResponseDTO(saved);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public Booking updateBooking(Booking bookingUpdate) {
        return bookingRepository.findById(bookingUpdate.getId())
                .map(existingBooking -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingBooking, bookingUpdate);
                        return bookingRepository.save(existingBooking);
                    } catch (JsonMappingException e) {
                        throw new RuntimeException("Failed to update booking", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Booking with ID " + bookingUpdate.getId() + " not found."));
    }

    public void deleteBookingById(Long id) {
        bookingRepository.deleteById(id);
    }

    public long getTotalBookingsForTour(Long tourId) {
        return bookingRepository.countBookingsByTourId(tourId);
    }
}
