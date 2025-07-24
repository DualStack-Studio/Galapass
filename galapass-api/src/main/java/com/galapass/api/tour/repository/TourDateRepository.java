package com.galapass.api.repository;

import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.TourDate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourDateRepository extends JpaRepository<TourDate, Long> {
    List<TourDate> findByTour(Tour tour);
}
