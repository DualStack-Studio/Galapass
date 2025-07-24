package com.galapass.api.repository;

import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.CompanyTourStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TourRepository extends JpaRepository<Tour, Long> {

    // Tours by company
    List<Tour> findByCompanyId(Long companyId);

    // Tours by guide and status (ACTIVE / INACTIVE)
    @Query("SELECT t FROM Tour t JOIN t.guides g WHERE g.id = :guideId AND t.status = :status")
    List<Tour> findToursByGuideIdAndStatus(@Param("guideId") Long guideId, @Param("status") CompanyTourStatus status);

    // Count of tours by guide and status
    @Query("SELECT COUNT(t) FROM Tour t JOIN t.guides g WHERE g.id = :guideId AND t.status = :status")
    Long countToursByGuideIdAndStatus(@Param("guideId") Long guideId, @Param("status") CompanyTourStatus status);


    // Count active tours by guide and company
    @Query("SELECT COUNT(t) FROM Tour t JOIN t.guides g WHERE g.id = :guideId AND t.company.id = :companyId AND t.status = :status")
    long countToursByGuideIdAndCompanyId(@Param("guideId") Long guideId,
                                         @Param("companyId") Long companyId,
                                         @Param("status") CompanyTourStatus status);
}
