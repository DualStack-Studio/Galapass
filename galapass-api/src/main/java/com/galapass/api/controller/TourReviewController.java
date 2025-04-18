package com.galapass.api.controller;

import com.galapass.api.entity.TourReview;
import com.galapass.api.service.TourReviewService;
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

    @GetMapping
    public ResponseEntity<List<TourReview>> getAllReviews() {
        return ResponseEntity.ok(tourReviewService.getAllReviews());
    }

    @PostMapping
    public ResponseEntity<TourReview> createReview(@RequestBody TourReview tourReview) {
        return ResponseEntity.ok(tourReviewService.createReview(tourReview));
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
