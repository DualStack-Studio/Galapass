package com.galapass.api.repository;

import com.galapass.api.entity.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.tourDate.tour.id = :tourId")
    Long countBookingsByTourId(@Param("tourId") Long tourId);

    List<Booking> findByTourDate_Tour_IdIn(List<Long> tourIds);

    List<Booking> findByTourDate_Tour_Owner_Id(Long ownerId);
}
