package com.galapass.api.controller;

import com.galapass.api.DTO.tour.CreateTourRequest;
import com.galapass.api.DTO.tour.TourPatchRequest;
import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.DTO.tourCompany.TourCompanyPatchRequest;
import com.galapass.api.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.entity.CompanyTourStatus;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.tour.TourCategory;
import com.galapass.api.entity.tour.TourTag;
import com.galapass.api.entity.user.User;
import com.galapass.api.mapper.TourMapper;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.UserRepository;
import com.galapass.api.service.TourService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

        Set<TourTag> tags = request.getTags() != null
                ? request.getTags().stream()
                .map(tag -> {
                    try {
                        return TourTag.valueOf(tag.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid tag: " + tag);
                    }
                })
                .collect(Collectors.toSet())
                : new HashSet<>();

        Tour tour = Tour.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(TourCategory.valueOf(request.getCategory()))
                .location(request.getLocation())
                .photoUrls(request.getPhotoUrls())
                .owner(owner)
                .company(company)
                .guides(guides)
                .tags(tags)
                .status(CompanyTourStatus.ACTIVE)
                .maxGuests(request.getMaxGuests())
                .duration(request.getDuration())
                .highlights(request.getHighlights())
                .build();

        Tour savedTour = tourRepository.save(tour);

        return ResponseEntity.ok(tourMapper.toTourResponseDTO(savedTour));
    }


    @GetMapping("/{id}")
    public ResponseEntity<List<TourResponseDTO>> getToursById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getToursById(id));
    }

    @PutMapping
    public ResponseEntity<Tour> updateTour(@RequestBody Tour tour) {
        return ResponseEntity.ok(tourService.updateTour(tour));
    }

    @DeleteMapping("/{id}")
    public void deleteTourById(@PathVariable Long id) {
        tourService.deleteTourById(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchTour(@PathVariable Long id, @RequestBody TourPatchRequest request) {
        try {
            TourResponseDTO updatedTour = tourService.patchTour(id, request);
            return ResponseEntity.ok(updatedTour);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
