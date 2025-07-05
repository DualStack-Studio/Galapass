package com.galapass.api.mapper;

import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.DTO.booking.BookingResponseSummaryDTO;
import com.galapass.api.entity.booking.Booking;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BookingMapper {

    private final UserMapper userMapper;
    private final TourMapper tourMapper;
    // We inject TourDateMapper lazily to break the dependency cycle
    private final TourDateMapper tourDateMapper;

    // Use a manual constructor to apply the @Lazy annotation
    public BookingMapper(UserMapper userMapper, TourMapper tourMapper, @Lazy TourDateMapper tourDateMapper) {
        this.userMapper = userMapper;
        this.tourMapper = tourMapper;
        this.tourDateMapper = tourDateMapper;
    }

    public BookingResponseDTO toBookingResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        // This call is now safe because tourDateMapper is lazily loaded
        dto.setTourDate(tourDateMapper.toTourDateSummaryDTO(booking.getTourDate()));
        dto.setGuides(
                booking.getGuides().stream()
                        .map(userMapper::toOwnerSummaryDTO)
                        .collect(Collectors.toSet())
        );
        dto.setTourists(booking.getTourists().stream()
                .map(userMapper::toOwnerSummaryDTO)
                .collect(Collectors.toSet()));
        dto.setTour(tourMapper.toTourOwnerViewDTO(booking.getTour()));
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPaid(booking.getTotalPaid());
        dto.setStatus(String.valueOf(booking.getStatus()));
        return dto;
    }

    public BookingResponseSummaryDTO toBookingResponseSummaryDTO(Booking booking) {
        BookingResponseSummaryDTO dto = new BookingResponseSummaryDTO();
        dto.setId(booking.getId());
        // The original "date" field is likely now redundant, as the full TourDate is available.
        // You might consider removing it from the summary to avoid confusion.
        // For now, we assume it's still needed.
        if (booking.getTourDate() != null) {
            dto.setDate(booking.getTourDate().getDate());
        }
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPaid(booking.getTotalPaid());
        dto.setStatus(String.valueOf(booking.getStatus()));
        return dto;
    }
}
