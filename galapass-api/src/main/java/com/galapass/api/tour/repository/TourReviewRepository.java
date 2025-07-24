package com.galapass.api.tour.repository;

import com.galapass.api.tour.entity.TourReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourReviewRepository extends JpaRepository<TourReview, Long> {
    List<TourReview> findByTourId(Long tourId);

    @Query("SELECT AVG(r.rating) FROM TourReview r WHERE r.tour.id = :tourId")
    Double getAverageRatingByTourId(@Param("tourId") Long tourId);

    Long countByTourId(Long tourId);
    @Query("SELECT AVG(r.rating) FROM TourReview r " +
            "JOIN r.tour.guides g " +
            "WHERE g.id = :guideId")
    Double getAverageRatingByGuideId(@Param("guideId") Long guideId);
}



