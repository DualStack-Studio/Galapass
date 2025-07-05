package com.galapass.api.service;

import com.galapass.api.DTO.tourDate.TourDateRequestDTO;
import com.galapass.api.DTO.tourDate.TourDateResponseDTO;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.TourDate;
import com.galapass.api.exception.TourNotFoundException;
import com.galapass.api.mapper.TourDateMapper;
import com.galapass.api.repository.TourDateRepository;
import com.galapass.api.repository.TourRepository;
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
}