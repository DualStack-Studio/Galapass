package com.galapass.api.tour.mapper;

import com.galapass.api.booking.entity.Booking;
import com.galapass.api.booking.entity.BookingStatus;
import com.galapass.api.booking.mapper.BookingMapper;
import com.galapass.api.media.DTO.MediaResponse;
import com.galapass.api.tour.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.tour.DTO.tourDate.TourDateRequestDTO;
import com.galapass.api.tour.DTO.tourDate.TourDateResponseDTO;
import com.galapass.api.tour.DTO.tourDate.TourDateSummaryDTO;
import com.galapass.api.tour.DTO.tourDate.TourDateTourDetailDTO;
import com.galapass.api.tour.entity.Tour;
import com.galapass.api.tour.entity.TourDate;
import com.galapass.api.tour.repository.TourReviewRepository;
import com.galapass.api.user.mapper.UserMapper;
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
    private final TourReviewRepository tourReviewRepository;
    private final UserMapper userMapper;

    /**
     * Converts a TourDateRequestDTO to a TourDate entity.
     *
     * @param dto  The request DTO containing tour date details.
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
        Tour tour = tourDate.getTour();

        // Manually build TourResponseOwnerViewDTO here instead of calling tourMapper
        TourResponseOwnerViewDTO tourDTO = TourResponseOwnerViewDTO.builder()
                .id(tour.getId())
                .title(tour.getTitle())
                .price(tour.getPrice())
                .location(tour.getLocation())
                .destination(tour.getDestination())
                .media(tour.getMedia().stream()
                        .map(media -> new MediaResponse(media.getUrl(), media.getType()))
                        .collect(Collectors.toList()))
                .status(String.valueOf(tour.getStatus()))
                .owner(userMapper.toOwnerSummaryDTO(tour.getOwner())) // Keep this line if userMapper is available
                .rating(tourReviewRepository.getAverageRatingByTourId(tour.getId()) != null
                        ? tourReviewRepository.getAverageRatingByTourId(tour.getId())
                        : 0.0)
                .reviewCount(tourReviewRepository.countByTourId(tour.getId()))
                .build();

        return TourDateSummaryDTO.builder()
                .id(tourDate.getId())
                .date(tourDate.getDate())
                .price(tourDate.getPrice())
                .available(tourDate.isAvailable())
                .maxGuests(tourDate.getMaxGuests())
                .tour(tourDTO)
                .build();
    }


    public TourDateTourDetailDTO toTourDateTourDetailDTO(TourDate tourDate) {
        TourDateTourDetailDTO dto = new TourDateTourDetailDTO();
        dto.setId(tourDate.getId());
        dto.setDate(tourDate.getDate());
        dto.setPrice(tourDate.getPrice());
        dto.setAvailable(tourDate.isAvailable());
        dto.setMaxGuests(tourDate.getMaxGuests());
        dto.setTotalPeopleBooked(tourDate.getBookings().stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .mapToInt(Booking::getNumberOfPeople)
                .sum());
        return dto;
    }


}
