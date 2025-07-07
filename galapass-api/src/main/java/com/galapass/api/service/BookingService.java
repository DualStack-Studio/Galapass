package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.booking.BookingRequestDTO;
import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.entity.TourDate;

import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.user.User;
import com.galapass.api.exception.TourNotFoundException; 
import com.galapass.api.mapper.BookingMapper;
import com.galapass.api.repository.BookingRepository;
import com.galapass.api.repository.TourDateRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.UserRepository;
import com.galapass.api.specification.BookingSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashSet;

import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;
    private final BookingMapper bookingMapper;
    private final TourDateRepository tourDateRepository;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        TourDate tourDate = tourDateRepository.findById(request.getTourDateId())
                .orElseThrow(() -> new TourNotFoundException("TourDate not found with id: " + request.getTourDateId()));

        Tour tour = tourDate.getTour();

        if (request.getNumberOfPeople() > tour.getMaxGuests()) {
            throw new IllegalArgumentException("Requested number of people exceeds the tour's max guest capacity.");
        }

        Set<User> guides = new HashSet<>(userRepository.findAllById(request.getGuideIds()));
        Set<User> tourists = new HashSet<>(userRepository.findAllById(request.getTouristIds()));

        Booking booking = Booking.builder()
                .guides(guides)
                .tourists(tourists)
                .date(request.getDate())
                .numberOfPeople(request.getNumberOfPeople())
                .tourDate(tourDate)
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


    public List<BookingResponseDTO> getBookingsByOwner(Long ownerId) {
        List<Booking> bookings = bookingRepository.findByTourDate_Tour_Owner_Id(ownerId);
        return bookings.stream()
                .map(bookingMapper::toBookingResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> searchBookings(Long ownerId, Long tourId, String status, String date, String search) {

        Specification<Booking> spec = Specification.where(null);

        // Security: Always scope to the owner if an ownerId is present
        if (ownerId != null) {
            spec = spec.and(BookingSpecification.hasOwnerId(ownerId));
        }

        // Add the tourId filter if it's provided
        if (tourId != null) {
            spec = spec.and(BookingSpecification.hasTourId(tourId));
        }

        if (status != null && !status.isBlank()) {
            try {
                spec = spec.and(BookingSpecification.hasStatus(BookingStatus.valueOf(status.toUpperCase())));
            } catch (IllegalArgumentException e) {
                // Log invalid status
            }
        }

        if (date != null && !date.isBlank()) {
            try {
                LocalDate parsedDate = LocalDate.parse(date);
                spec = spec.and(BookingSpecification.onDate(parsedDate));
            } catch (DateTimeParseException e) {
                // Log invalid date format
            }
        }

        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and(BookingSpecification.containsSearchTerm(search));
        }

        List<Booking> bookings = bookingRepository.findAll(spec);

        return bookings.stream()
                .map(bookingMapper::toBookingResponseDTO)
                .toList();
    }


    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        Booking savedBooking = bookingRepository.save(booking);

        return bookingMapper.toBookingResponseDTO(savedBooking);
    }

    public List<Booking> getBookingsByGuideAndStatus(Long guideId, BookingStatus status) {
              return bookingRepository.findBookingsByGuideIdAndStatus(guideId, status);
    }

    public List<Booking> getUpcomingBookingsByGuide(Long guideId) {
        List<BookingStatus> statuses = List.of(BookingStatus.CONFIRMED, BookingStatus.PENDING);
        return bookingRepository.findUpcomingBookingsByGuideId(guideId, statuses);
    }

    public List<Booking> getBookingHistoryByGuide(Long guideId) {
                return bookingRepository.findBookingHistoryByGuideId(guideId);
    }

    public List<BookingResponseDTO> getBookingByTourId(Long tourId) {
        List<Booking> bookings = bookingRepository.findByTourDate_Tour_Id(tourId);
        return bookings.stream()
                .map(bookingMapper::toBookingResponseDTO)
                .collect(Collectors.toList());
    }
}
