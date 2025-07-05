package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.booking.BookingRequestDTO;
import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.entity.TourDate;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.user.User;
import com.galapass.api.exception.TourNotFoundException; // Assuming you have this
import com.galapass.api.mapper.BookingMapper;
import com.galapass.api.repository.BookingRepository;
import com.galapass.api.repository.TourDateRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    // It's better to define the ObjectMapper as a bean, but for now, this is fine.
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
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking updateBooking(Booking bookingUpdate) {
        return bookingRepository.findById(bookingUpdate.getId())
                .map(existingBooking -> {
                    try {
                        objectMapper.updateValue(existingBooking, bookingUpdate);
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

    public List<BookingResponseDTO> getBookingsByOwner(Long ownerId) {
        List<Booking> bookings = bookingRepository.findByTourDate_Tour_Owner_Id(ownerId);
        return bookings.stream()
                .map(bookingMapper::toBookingResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> searchBookingsByOwner(Long ownerId, String status, String date, String search) {
        List<Booking> bookings = bookingRepository.findByTourDate_Tour_Owner_Id(ownerId);
        Stream<Booking> stream = bookings.stream();


        // Filter by status
        if (status != null && !status.isBlank()) {
            try {
                BookingStatus statusEnum = BookingStatus.valueOf(status.toUpperCase());
                stream = stream.filter(b -> b.getStatus() == statusEnum);
            } catch (IllegalArgumentException e) {
                // It's better to silently ignore invalid statuses or log a warning
                System.err.println("Invalid booking status provided: " + status);
            }
        }

        // Filter by date
        if (date != null && !date.isBlank()) {
            stream = stream.filter(b -> {
                String bookingDate = new java.text.SimpleDateFormat("yyyy-MM-dd").format(b.getDate());
                return bookingDate.equals(date);
            });
        }

        // Filter by search term
        if (search != null && !search.trim().isEmpty()) {
            String lowerSearch = search.toLowerCase();
            stream = stream.filter(b ->
                    b.getTourDate().getTour().getTitle().toLowerCase().contains(lowerSearch) ||
                            b.getTourDate().getTour().getLocation().toLowerCase().contains(lowerSearch) ||
                            b.getTourists().stream().anyMatch(t -> t.getName().toLowerCase().contains(lowerSearch))
            );
        }

        return stream.map(bookingMapper::toBookingResponseDTO).toList();
    }
}
