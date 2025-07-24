package com.galapass.api.tour.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.booking.entity.Booking;
import com.galapass.api.booking.repository.BookingRepository;
import com.galapass.api.tour.DTO.tourReview.TourReviewRequest;
import com.galapass.api.tour.entity.Tour;
import com.galapass.api.tour.entity.TourReview;
import com.galapass.api.tour.repository.TourRepository;
import com.galapass.api.tour.repository.TourReviewRepository;
import com.galapass.api.user.entity.User;
import com.galapass.api.user.repository.UserRepository;
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
