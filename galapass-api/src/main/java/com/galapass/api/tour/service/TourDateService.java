package com.galapass.api.service;

import com.galapass.api.DTO.tourDate.TourDateRequestDTO;
import com.galapass.api.DTO.tourDate.TourDateResponseDTO;
import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.TourDate;
import com.galapass.api.exception.TourNotFoundException;
import com.galapass.api.mapper.TourDateMapper;
import com.galapass.api.repository.TourDateRepository;
import com.galapass.api.repository.TourRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourDateService {

    private final TourDateRepository tourDateRepository;
    private final TourRepository tourRepository;
    private final TourDateMapper mapper;

    public List<TourDateResponseDTO> getDatesForTour(Long tourId, Long ownerId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException("Tour with ID " + tourId + " not found"));

        if (!tour.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not own this tour.");
        }

        return tourDateRepository.findByTour(tour)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public TourDateResponseDTO createTourDate(TourDateRequestDTO dto, Long ownerId) {
        Tour tour = tourRepository.findById(dto.getTourId()).orElseThrow();

        if (!tour.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not own this tour.");
        }

        TourDate entity = mapper.toEntity(dto, tour);
        return mapper.toDTO(tourDateRepository.save(entity));
    }

    public void deleteTourDate(Long id, Long ownerId) {
        TourDate tourDate = tourDateRepository.findById(id)
                .orElseThrow(() -> new TourNotFoundException("Tour date not found with id: " + id));

        Tour tour = tourDate.getTour();
        if (!tour.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to delete this tour date.");
        }

        if (tourDate.getBookings() != null && !tourDate.getBookings().isEmpty()) {
            throw new IllegalStateException("Cannot delete tour date with existing bookings.");
        }

        tourDateRepository.deleteById(id);
    }

    /**
     * Cancels a tour date, updating its status and handling all associated bookings.
     * This is a transactional operation to ensure all database changes succeed or fail together.
     * @param id The ID of the tour date to cancel.
     * @param ownerId The ID of the user performing the action, for permission checking.
     * @return A DTO representing the updated, cancelled tour date.
     */
    @Transactional
    public TourDateResponseDTO cancelTourDate(Long id, Long ownerId) {
        TourDate tourDate = tourDateRepository.findById(id)
                .orElseThrow(() -> new TourNotFoundException("Tour date not found with id: " + id));

        Tour tour = tourDate.getTour();
        if (!tour.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to modify this tour date.");
        }

        // Update the tour date status
        tourDate.setAvailable(false);
        // Assuming you have a status field. If not, 'available=false' might be sufficient.
        // tourDate.setStatus("CANCELLED");

        // Handle all associated bookings
        if (tourDate.getBookings() != null && !tourDate.getBookings().isEmpty()) {
            for (Booking booking : tourDate.getBookings()) {
                // 1. Update booking status
                booking.setStatus(BookingStatus.CANCELED);

                // 2. TODO: Trigger email notification to the tourist
                // emailService.sendCancellationNotice(booking.getTourist());

                // 3. TODO: Initiate refund process
                // paymentService.processRefund(booking.getPaymentTransactionId());
            }
        }

        // Save the updated tour date (and cascaded bookings)
        TourDate updatedTourDate = tourDateRepository.save(tourDate);

        return mapper.toDTO(updatedTourDate);
    }
}