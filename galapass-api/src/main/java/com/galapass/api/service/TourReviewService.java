package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.entity.TourReview;
import com.galapass.api.repository.TourReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourReviewService {

    private final TourReviewRepository tourReviewRepository;

    public List<TourReview> getAllReviews() {
        return tourReviewRepository.findAll();
    }

    public TourReview getReviewById(Long id) {
        return tourReviewRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Review with ID " + id + " not found."));
    }

    public TourReview createReview(TourReview review) {
        return tourReviewRepository.save(review);
    }

    public TourReview updateReview(TourReview reviewUpdate) {
        return tourReviewRepository.findById(reviewUpdate.getId())
                .map(existingReview -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingReview, reviewUpdate);
                        return tourReviewRepository.save(existingReview);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update tour review", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Review with ID " + reviewUpdate.getId() + " not found."));
    }

    public void deleteReviewById(Long id) {
        tourReviewRepository.deleteById(id);
    }
}
