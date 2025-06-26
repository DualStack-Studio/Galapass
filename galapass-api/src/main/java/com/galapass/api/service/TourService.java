package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.TourReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourService {
    private final TourRepository tourRepository;
    private final TourReviewRepository tourReviewRepository;

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public Tour getTourById(Long id) {
        return tourRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Tour with ID " + id + " not found."));
    }

    public List<Tour> getToursByCompanyId(Long companyId) {
        return tourRepository.findByCompanyId(companyId);
    }

    public Tour createTour(Tour tour) {
        return tourRepository.save(tour);
    }

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public Tour updateTour(Tour tourUpdate) {
        return tourRepository.findById(tourUpdate.getId())
                .map(existingTour -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingTour, tourUpdate);
                        return tourRepository.save(existingTour);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update tour", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Tour with ID " + tourUpdate.getId() + " not found."));
    }

    public void deleteTourById(Long id) {
        tourRepository.deleteById(id);
    }

    public double calculateAverageTourRating(Long tourId) {
        Double avg = tourReviewRepository.getAverageRatingByTourId(tourId);
        return avg != null ? avg : 0.0;
    }
}
