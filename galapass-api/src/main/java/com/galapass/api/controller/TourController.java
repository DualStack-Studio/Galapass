package com.galapass.api.controller;

import com.galapass.api.DTO.CreateTourRequest;
import com.galapass.api.DTO.TourResponseDTO;
import com.galapass.api.entity.Tour;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.User;
import com.galapass.api.mapper.TourMapper;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.UserRepository;
import com.galapass.api.service.TourService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
@Tag(name = "Tour API", description = "Tour API")
public class TourController {

    private final TourService tourService;
    private final UserRepository userRepository;
    private final TourCompanyRepository tourCompanyRepository;
    private final TourRepository tourRepository;
    private final TourMapper tourMapper;


    @GetMapping
    public ResponseEntity<List<TourResponseDTO>> getAllTours() {
        List<Tour> tours = tourService.getAllTours();
        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    @PostMapping
    public ResponseEntity<TourResponseDTO> createTour(@RequestBody CreateTourRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + request.getOwnerId()));
        TourCompany company = tourCompanyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + request.getCompanyId()));
        Set<User> guides = new HashSet<>(userRepository.findAllById(request.getGuideIds()));

        Tour tour = Tour.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .location(request.getLocation())
                .photoUrl(request.getPhotoUrl())
                .owner(owner)
                .company(company)
                .guides(guides)
                .build();

        Tour savedTour = tourRepository.save(tour);

        return ResponseEntity.ok(tourMapper.toTourResponseDTO(savedTour));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }

    @PutMapping
    public ResponseEntity<Tour> updateTour(@RequestBody Tour tour) {
        return ResponseEntity.ok(tourService.updateTour(tour));
    }

    @DeleteMapping("/{id}")
    public void deleteTourById(@PathVariable Long id) {
        tourService.deleteTourById(id);
    }
}
