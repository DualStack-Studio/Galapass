package com.galapass.api.tour.repository;

import com.galapass.api.tour.entity.TourCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TourCompanyRepository extends JpaRepository<TourCompany, Long> {
    Optional<TourCompany> findByName(String name);

    List<TourCompany> findAllByOwner_Id(Long ownerId);
    @Query("SELECT c FROM TourCompany c JOIN c.guides g WHERE g.id = :guideId")
    List<TourCompany> findAllByGuideId(@Param("guideId") Long guideId);

}
