package com.galapass.api.booking.repository;


import com.galapass.api.booking.entity.Booking;
import com.galapass.api.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.tourDate.tour.id = :tourId")
    Long countBookingsByTourId(@Param("tourId") Long tourId);

    List<Booking> findByTourDate_Tour_IdIn(List<Long> tourIds);

    List<Booking> findByTourDate_Tour_Id(Long tourIds);
    List<Booking> findByTourDate_Tour_Owner_Id(Long ownerId);

    List<Booking> findByTourDate_Guides_Id(Long guideId);

    @Query("SELECT b FROM Booking b JOIN b.tourDate.guides g WHERE g.id = :guideId AND b.status = :status")
    List<Booking> findBookingsByGuideIdAndStatus(@Param("guideId") Long guideId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b JOIN b.tourDate.guides g WHERE g.id = :guideId AND b.status IN (:statuses) AND b.date > CURRENT_DATE")
    List<Booking> findUpcomingBookingsByGuideId(@Param("guideId") Long guideId, @Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT b FROM Booking b JOIN b.tourDate.guides g WHERE g.id = :guideId ORDER BY b.date DESC")
    List<Booking> findBookingHistoryByGuideId(@Param("guideId") Long guideId);


    @Query("SELECT COUNT(DISTINCT b.tourDate.tour.id) FROM Booking b JOIN b.guides g WHERE g.id = :guideId AND b.status = 'CONFIRMED'")
    long countActiveToursByGuideId(@Param("guideId") Long guideId);

    @Query("SELECT COUNT(DISTINCT b.tourDate.tour.id) FROM Booking b JOIN b.guides g WHERE g.id = :guideId AND b.status IN ('CONFIRMED', 'PENDING') AND b.date > CURRENT_DATE")
    long countUpcomingToursByGuideId(@Param("guideId") Long guideId);

    @Query("SELECT COUNT(DISTINCT b.tourDate.tour.id) FROM Booking b JOIN b.guides g WHERE g.id = :guideId AND b.status = 'COMPLETED'")
    long countCompletedToursByGuideId(@Param("guideId") Long guideId);

    @Query("SELECT COALESCE(SUM(b.totalPaid), 0) FROM Booking b JOIN b.guides g WHERE g.id = :guideId AND b.status = 'COMPLETED'")
    BigDecimal getTotalEarningsByGuideId(@Param("guideId") Long guideId);

    

}
