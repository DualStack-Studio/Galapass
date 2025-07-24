package com.galapass.api.tour.controller;

import com.galapass.api.tour.DTO.tourReview.TourReviewRequest;
import com.galapass.api.tour.DTO.tourReview.TourReviewResponse;
import com.galapass.api.tour.entity.TourReview;
import com.galapass.api.tour.mapper.TourReviewMapper;
import com.galapass.api.tour.service.TourReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tour-reviews")
@RequiredArgsConstructor
@Tag(name = "Tour Review API", description = "Tour Review API")
public class TourReviewController {

    private final TourReviewService tourReviewService;
    private final TourReviewMapper tourReviewMapper;

    @GetMapping
    public ResponseEntity<List<TourReview>> getAllReviews() {
        return ResponseEntity.ok(tourReviewService.getAllReviews());
    }

    @PostMapping
    public ResponseEntity<TourReviewResponse> createReview(@RequestBody TourReviewRequest request) {
        TourReview review = tourReviewService.createReview( request);
        return ResponseEntity.ok(tourReviewMapper.toReviewResponse(review));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourReview> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(tourReviewService.getReviewById(id));
    }

    @PutMapping
    public ResponseEntity<TourReview> updateReview(@RequestBody TourReview tourReview) {
        return ResponseEntity.ok(tourReviewService.updateReview(tourReview));
    }

    @DeleteMapping("/{id}")
    public void deleteReviewById(@PathVariable Long id) {
        tourReviewService.deleteReviewById(id);
    }
}
