package com.galapass.api.repository;

import com.galapass.api.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByCompanyId(Long companyId);
}
