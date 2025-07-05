package com.galapass.api.repository;

import com.galapass.api.entity.booking.Booking;
import com.galapass.api.entity.booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.tour.id = :tourId")
    Long countBookingsByTourId(@Param("tourId") Long tourId);

    List<Booking> findByTourIdIn(List<Long> tourIds);

    @Query("SELECT b FROM Booking b JOIN b.tour.guides g WHERE g.id = :guideId AND b.status = :status")
    List<Booking> findBookingsByGuideIdAndStatus(@Param("guideId") Long guideId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b JOIN b.tour.guides g WHERE g.id = :guideId AND b.status IN (:statuses) AND b.date > CURRENT_DATE")
    List<Booking> findUpcomingBookingsByGuideId(@Param("guideId") Long guideId, @Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT b FROM Booking b JOIN b.tour.guides g WHERE g.id = :guideId ORDER BY b.date DESC")
    List<Booking> findBookingHistoryByGuideId(@Param("guideId") Long guideId);

}
