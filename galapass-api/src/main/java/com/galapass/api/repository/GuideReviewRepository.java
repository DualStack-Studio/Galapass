package com.galapass.api.repository;

import com.galapass.api.entity.GuideReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuideReviewRepository extends JpaRepository<GuideReview, Long> {

    List<GuideReview> findByGuideId(Long guideId);

    @Query("SELECT AVG(r.rating) FROM GuideReview r WHERE r.guide.id = :guideId")
    Double getAverageRatingByGuideId(@Param("guideId") Long guideId);
}