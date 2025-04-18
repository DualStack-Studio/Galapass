package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.entity.GuideReview;
import com.galapass.api.repository.GuideReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GuideReviewService {

    private final GuideReviewRepository guideReviewRepository;

    public List<GuideReview> getAllReviews() {
        return guideReviewRepository.findAll();
    }

    public GuideReview getReviewById(Long id) {
        return guideReviewRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Review with ID " + id + " not found."));
    }

    public GuideReview createReview(GuideReview review) {
        return guideReviewRepository.save(review);
    }

    public GuideReview updateReview(GuideReview reviewUpdate) {
        return guideReviewRepository.findById(reviewUpdate.getId())
                .map(existingReview -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingReview, reviewUpdate);
                        return guideReviewRepository.save(existingReview);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update guide review", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Review with ID " + reviewUpdate.getId() + " not found."));
    }

    public void deleteReviewById(Long id) {
        guideReviewRepository.deleteById(id);
    }
}
