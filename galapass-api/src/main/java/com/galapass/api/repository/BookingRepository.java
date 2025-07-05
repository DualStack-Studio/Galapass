package com.galapass.api.repository;

import com.galapass.api.entity.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.tour.id = :tourId")
    Long countBookingsByTourId(@Param("tourId") Long tourId);

    List<Booking> findByTourIdIn(List<Long> tourIds);

    List<Booking> findByTour_Company_Owner_Id(Long ownerId);
}
