package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.galapass.api.entity.Booking;
import com.galapass.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public Booking updateBooking(Booking bookingUpdate) {
        return bookingRepository.findById(bookingUpdate.getId())
                .map(existingBooking -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingBooking, bookingUpdate);
                        return bookingRepository.save(existingBooking);
                    } catch (JsonMappingException e) {
                        throw new RuntimeException("Failed to update booking", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Booking with ID " + bookingUpdate.getId() + " not found."));
    }

    public void deleteBookingById(Long id) {
        bookingRepository.deleteById(id);
    }
}
