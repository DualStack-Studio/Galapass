package com.galapass.api.user.controller;

import com.galapass.api.user.DTO.guideReview.GuideReviewRequestDTO;
import com.galapass.api.user.DTO.guideReview.GuideReviewResponseDTO;
import com.galapass.api.user.service.GuideReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide-reviews")
@RequiredArgsConstructor
public class GuideReviewController {

    private final GuideReviewService guideReviewService;

    @PostMapping
    public ResponseEntity<GuideReviewResponseDTO> createReview(@RequestBody GuideReviewRequestDTO request) {
        return ResponseEntity.ok(guideReviewService.createReview(request));
    }

    @GetMapping
    public ResponseEntity<List<GuideReviewResponseDTO>> getAllReviews() {
        return ResponseEntity.ok(guideReviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuideReviewResponseDTO> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(guideReviewService.getReviewById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        guideReviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}
