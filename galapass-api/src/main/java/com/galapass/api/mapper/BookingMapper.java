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
    private final TourDateMapper tourDateMapper;

    public BookingMapper(UserMapper userMapper, @Lazy TourDateMapper tourDateMapper) {
        this.userMapper = userMapper;
        this.tourDateMapper = tourDateMapper;
    }

    public BookingResponseDTO toBookingResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setTourDate(tourDateMapper.toTourDateSummaryDTO(booking.getTourDate()));
        dto.setGuides(
                booking.getGuides().stream()
                        .map(userMapper::toOwnerSummaryDTO)
                        .collect(Collectors.toSet())
        );
        dto.setTourists(booking.getTourists().stream()
                .map(userMapper::toOwnerSummaryDTO)
                .collect(Collectors.toSet()));
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPaid(booking.getTotalPaid());
        dto.setStatus(String.valueOf(booking.getStatus()));
        return dto;
    }

    public BookingResponseSummaryDTO toBookingResponseSummaryDTO(Booking booking) {
        BookingResponseSummaryDTO dto = new BookingResponseSummaryDTO();
        dto.setId(booking.getId());
        if (booking.getTourDate() != null) {
            dto.setDate(booking.getTourDate().getDate());
        }
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPaid(booking.getTotalPaid());
        dto.setStatus(String.valueOf(booking.getStatus()));
        return dto;
    }
}
