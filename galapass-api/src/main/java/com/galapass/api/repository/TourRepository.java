package com.galapass.api.repository;

import com.galapass.api.entity.tour.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByCompanyId(Long companyId);

    @Query("SELECT COUNT(t) FROM Tour t JOIN t.guides g WHERE g.id = :guideId AND t.status = com.galapass.api.entity.CompanyTourStatus.ACTIVE")
    Long countActiveToursByGuideId(@Param("guideId") Long guideId);

}
