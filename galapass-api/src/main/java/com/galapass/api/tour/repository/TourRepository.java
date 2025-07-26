package com.galapass.api.tour.repository;

import com.galapass.api.tour.entity.CompanyTourStatus;
import com.galapass.api.tour.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {

    // Tours by company
    List<Tour> findByCompanyId(Long companyId);

    // Tours by guide and status (ACTIVE / INACTIVE)
    @Query("SELECT DISTINCT t FROM Tour t JOIN t.tourDates td JOIN td.guides g WHERE g.id = :guideId AND t.status = :status")
    List<Tour> findToursByGuideIdAndStatus(@Param("guideId") Long guideId, @Param("status") CompanyTourStatus status);

    // Count of tours by guide and status
    @Query("SELECT COUNT(DISTINCT t) FROM Tour t JOIN t.tourDates td JOIN td.guides g WHERE g.id = :guideId AND t.status = :status")
    Long countToursByGuideIdAndStatus(@Param("guideId") Long guideId, @Param("status") CompanyTourStatus status);

    // Count active tours by guide and company
    @Query("SELECT COUNT(DISTINCT t) FROM Tour t JOIN t.tourDates td JOIN td.guides g WHERE g.id = :guideId AND t.company.id = :companyId AND t.status = :status")
    long countToursByGuideIdAndCompanyId(@Param("guideId") Long guideId,
                                         @Param("companyId") Long companyId,
                                         @Param("status") CompanyTourStatus status);
}