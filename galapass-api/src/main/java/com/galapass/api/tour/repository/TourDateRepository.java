package com.galapass.api.tour.repository;

import com.galapass.api.tour.entity.Tour;
import com.galapass.api.tour.entity.TourDate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourDateRepository extends JpaRepository<TourDate, Long> {
    List<TourDate> findByTour(Tour tour);
}
