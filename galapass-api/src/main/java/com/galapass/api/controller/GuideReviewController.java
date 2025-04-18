package com.galapass.api.controller;

import com.galapass.api.entity.GuideReview;
import com.galapass.api.service.GuideReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide-reviews")
@RequiredArgsConstructor
@Tag(name = "Guide Review API", description = "Guide Review API")
public class GuideReviewController {

    private final GuideReviewService guideReviewService;

    @GetMapping
    public ResponseEntity<List<GuideReview>> getAllReviews() {
        return ResponseEntity.ok(guideReviewService.getAllReviews());
    }

    @PostMapping
    public ResponseEntity<GuideReview> createReview(@RequestBody GuideReview guideReview) {
        return ResponseEntity.ok(guideReviewService.createReview(guideReview));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuideReview> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(guideReviewService.getReviewById(id));
    }

    @PutMapping
    public ResponseEntity<GuideReview> updateReview(@RequestBody GuideReview guideReview) {
        return ResponseEntity.ok(guideReviewService.updateReview(guideReview));
    }

    @DeleteMapping("/{id}")
    public void deleteReviewById(@PathVariable Long id) {
        guideReviewService.deleteReviewById(id);
    }
}
