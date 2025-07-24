package com.galapass.api.user.service;

import com.galapass.api.booking.entity.Booking;
import com.galapass.api.booking.repository.BookingRepository;
import com.galapass.api.user.DTO.guideReview.GuideReviewRequestDTO;
import com.galapass.api.user.DTO.guideReview.GuideReviewResponseDTO;
import com.galapass.api.user.entity.GuideReview;
import com.galapass.api.user.entity.User;
import com.galapass.api.user.mapper.GuideReviewMapper;
import com.galapass.api.user.repository.GuideReviewRepository;
import com.galapass.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuideReviewService {

    private final GuideReviewRepository guideReviewRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final GuideReviewMapper guideReviewMapper;

    public GuideReviewResponseDTO createReview(GuideReviewRequestDTO request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User guide = userRepository.findById(request.getGuideId())
                .orElseThrow(() -> new RuntimeException("Guide not found"));

        User reviewer = userRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        GuideReview review = GuideReview.builder()
                .booking(booking)
                .guide(guide)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        GuideReview saved = guideReviewRepository.save(review);
        return guideReviewMapper.toGuideReviewResponseDTO(saved);
    }

    public List<GuideReviewResponseDTO> getAllReviews() {
        return guideReviewRepository.findAll().stream()
                .map(guideReviewMapper::toGuideReviewResponseDTO)
                .collect(Collectors.toList());
    }

    public GuideReviewResponseDTO getReviewById(Long id) {
        GuideReview review = guideReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return guideReviewMapper.toGuideReviewResponseDTO(review);
    }

    public void deleteReview(Long id) {
        guideReviewRepository.deleteById(id);
    }
}
