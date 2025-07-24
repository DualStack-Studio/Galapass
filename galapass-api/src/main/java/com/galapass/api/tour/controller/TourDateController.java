package com.galapass.api.controller;

import com.galapass.api.DTO.tourDate.TourDateRequestDTO;
import com.galapass.api.DTO.tourDate.TourDateResponseDTO;
import com.galapass.api.entity.user.User;
import com.galapass.api.service.TourDateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tour-dates")
@RequiredArgsConstructor
public class TourDateController {

    private final TourDateService service;

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<TourDateResponseDTO>> getTourDates(
            @PathVariable Long tourId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(service.getDatesForTour(tourId, currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<TourDateResponseDTO> createTourDate(@RequestBody TourDateRequestDTO dto,  @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(service.createTourDate(dto, currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourDate(@PathVariable Long id, @AuthenticationPrincipal User user) {
        service.deleteTourDate(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<TourDateResponseDTO> cancelTourDate(@PathVariable Long id, @AuthenticationPrincipal User user) {
        TourDateResponseDTO updatedTourDate = service.cancelTourDate(id, user.getId());
        return ResponseEntity.ok(updatedTourDate);
    }
}