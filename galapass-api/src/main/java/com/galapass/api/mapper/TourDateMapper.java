package com.galapass.api.mapper;

import com.galapass.api.DTO.booking.BookingResponseSummaryDTO;
import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.DTO.tourDate.TourDateRequestDTO;
import com.galapass.api.DTO.tourDate.TourDateResponseDTO;
import com.galapass.api.DTO.tourDate.TourDateSummaryDTO;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.TourDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Maps between TourDate entities and their corresponding DTOs.
 * It handles conversion for request and response objects.
 */
@Component
@RequiredArgsConstructor // Generates a constructor with required final fields (constructor injection)
public class TourDateMapper {

    // Injecting BookingMapper to handle booking-related mapping.
    // This promotes separation of concerns and uses the application's main BookingMapper.
    private final BookingMapper bookingMapper;
    private final TourMapper tourMapper;

    /**
     * Converts a TourDateRequestDTO to a TourDate entity.
     *
     * @param dto The request DTO containing tour date details.
     * @param tour The parent Tour entity to associate with this date.
     * @return A new TourDate entity, ready to be persisted.
     */
    public TourDate toEntity(TourDateRequestDTO dto, Tour tour) {
        return TourDate.builder()
                .date(dto.getDate())
                .price(dto.getPrice())
                .available(dto.isAvailable())
                .maxGuests(dto.getMaxGuests())
                .tour(tour)
                // It's good practice to initialize collections to avoid NullPointerExceptions.
                .bookings(Collections.emptyList())
                .build();
    }

    /**
     * Converts a TourDate entity to a TourDateResponseDTO.
     *
     * @param tourDate The entity from the database.
     * @return A DTO suitable for sending to the client.
     */
    public TourDateResponseDTO toDTO(TourDate tourDate) {
        // Using a builder for the DTO as well for consistency and immutability.
        return TourDateResponseDTO.builder()
                .id(tourDate.getId())
                .date(tourDate.getDate())
                .price(tourDate.getPrice())
                .available(tourDate.isAvailable())
                .maxGuests(tourDate.getMaxGuests())
                // Safely get the tour ID, handling cases where the tour might be null.
                .tourId(tourDate.getTour() != null ? tourDate.getTour().getId() : null)
                // Use Optional to safely handle potentially null collections.
                .bookings(Optional.ofNullable(tourDate.getBookings())
                        .orElse(Collections.emptyList()) // Default to an empty list if null
                        .stream()
                        // Delegate the conversion of each booking to the injected BookingMapper.
                        .map(bookingMapper::toBookingResponseSummaryDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    public TourDateSummaryDTO toTourDateSummaryDTO(TourDate tourDate) {
        // 1. Get the raw Tour entity from the TourDate object
        Tour tourEntity = tourDate.getTour();

        // 2. **THE MISSING STEP**: Convert the Tour entity into the correct DTO
        TourResponseOwnerViewDTO tourDTO = tourMapper.toTourResponseOwnerViewDTO(tourEntity);

        return TourDateSummaryDTO.builder()
                .id(tourDate.getId())
                .date(tourDate.getDate())
                .price(tourDate.getPrice())
                .available(tourDate.isAvailable())
                .maxGuests(tourDate.getMaxGuests())
                .tour(tourDTO)
                .build();
    }
}
