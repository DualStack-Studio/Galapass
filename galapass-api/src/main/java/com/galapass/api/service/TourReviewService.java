package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.tourReview.TourReviewRequest;
import com.galapass.api.entity.Booking;
import com.galapass.api.entity.TourReview;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.user.User;
import com.galapass.api.repository.BookingRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.TourReviewRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourReviewService {

    private final TourReviewRepository tourReviewRepository;
    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public List<TourReview> getAllReviews() {
        return tourReviewRepository.findAll();
    }

    public TourReview getReviewById(Long id) {
        return tourReviewRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Review with ID " + id + " not found."));
    }

    public TourReview createReview(TourReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        User reviewer = userRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TourReview review = TourReview.builder()
                .booking(booking)
                .tour(tour)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

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
