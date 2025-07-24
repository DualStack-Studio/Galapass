package com.galapass.api.booking.specification;

import com.galapass.api.booking.entity.Booking;
import com.galapass.api.booking.entity.BookingStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class BookingSpecification {

    public static Specification<Booking> hasTourDateId(Long tourDateId) {
        return (root, query, cb) -> cb.equal(root.get("tourDate").get("id"), tourDateId);
    }

    public static Specification<Booking> hasOwnerId(Long ownerId) {
        return (root, query, cb) -> cb.equal(root.get("tourDate").get("tour").get("owner").get("id"), ownerId);
    }

    public static Specification<Booking> hasTourId(Long tourId) {
        return (root, query, cb) -> cb.equal(root.get("tourDate").get("tour").get("id"), tourId);
    }

    public static Specification<Booking> hasStatus(BookingStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Booking> onDate(LocalDate date) {
        return (root, query, cb) -> {
            ZonedDateTime startOfDay = date.atStartOfDay(ZoneOffset.UTC);
            ZonedDateTime startOfNextDay = date.plusDays(1).atStartOfDay(ZoneOffset.UTC);

            return cb.and(
                    cb.greaterThanOrEqualTo(root.get("date"), startOfDay.toInstant()),
                    cb.lessThan(root.get("date"), startOfNextDay.toInstant())
            );
        };
    }

    public static <Tourist> Specification<Booking> containsSearchTerm(String search) {
        String pattern = "%" + search.toLowerCase() + "%";
        return (root, query, cb) -> {
            Join<Booking, Tourist> touristJoin = root.join("tourists", JoinType.LEFT);
            query.distinct(true);

            return cb.or(
                    cb.like(cb.lower(root.get("tourDate").get("tour").get("title")), pattern),
                    cb.like(cb.lower(root.get("tourDate").get("tour").get("location")), pattern),
                    cb.like(cb.lower(touristJoin.get("name")), pattern)
            );
        };
    }
}