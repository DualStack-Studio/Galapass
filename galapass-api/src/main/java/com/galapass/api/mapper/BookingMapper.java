package com.galapass.api.mapper;

import com.galapass.api.DTO.booking.BookingResponseDTO;
import com.galapass.api.entity.booking.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final UserMapper userMapper;
    private final TourMapper tourMapper;

    public BookingResponseDTO toBookingResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setTourists(booking.getTourists().stream()
                .map(userMapper::toOwnerSummaryDTO)
                .collect(Collectors.toSet()));
        dto.setTour(tourMapper.toTourOwnerViewDTO(booking.getTour()));
        dto.setDate(booking.getDate());
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalPaid(booking.getTotalPaid());
        dto.setStatus(booking.getStatus());
        return dto;
    }
}
