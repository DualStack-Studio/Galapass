package com.galapass.api.controller;

import com.galapass.api.DTO.tour.CreateTourRequest;
import com.galapass.api.DTO.tour.TourPatchRequest;
import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.DTO.tourCompany.TourCompanyPatchRequest;
import com.galapass.api.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.entity.CompanyTourStatus;

import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.tour.TourCategory;
import com.galapass.api.entity.tour.TourStatus;
import com.galapass.api.entity.tour.TourTag;
import com.galapass.api.entity.TourCompany;
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

import java.math.BigDecimal;
import java.util.*;
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

        Set<TourTag> tags = Optional.ofNullable(request.getTags()).orElse(Set.of()).stream()
                .map(tag -> {
                    try {
                        return TourTag.valueOf(tag.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid tag: " + tag);
                    }
                })
                .collect(Collectors.toSet());

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
                .status(TourStatus.ACTIVE)
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

    @GetMapping("/guide/{guideId}/active")
    public ResponseEntity<List<TourResponseDTO>> getActiveToursByGuide(@PathVariable Long guideId) {
        return ResponseEntity.ok(
                tourMapper.toTourResponseDTOList(tourService.getActiveToursByGuideId(guideId))
        );
    }

    @GetMapping("/guide/{guideId}/inactive")
    public ResponseEntity<List<TourResponseDTO>> getInactiveToursByGuide(@PathVariable Long guideId) {
        return ResponseEntity.ok(
                tourMapper.toTourResponseDTOList(tourService.getInactiveToursByGuideId(guideId))
        );
    }

    @GetMapping("/guide/{guideId}/history")
    public ResponseEntity<List<TourResponseDTO>> getTourHistory(@PathVariable Long guideId) {
        return ResponseEntity.ok(
                tourMapper.toTourResponseDTOList(tourService.getTourHistoryByGuideId(guideId))
        );
    }

    @GetMapping("/guide/{guideId}/earnings/active")
    public ResponseEntity<BigDecimal> getActiveEarnings(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourService.sumEarningsByGuideIdAndStatus(guideId, TourStatus.ACTIVE));
    }

    @GetMapping("/guide/{guideId}/earnings/inactive")
    public ResponseEntity<BigDecimal> getInactiveEarnings(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourService.sumEarningsByGuideIdAndStatus(guideId, TourStatus.INACTIVE));
    }

    @GetMapping("/guide/{guideId}/count/active")
    public ResponseEntity<Long> countActiveTours(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourService.countToursByGuideIdAndStatus(guideId, TourStatus.ACTIVE));
    }

    @GetMapping("/guide/{guideId}/count/inactive")
    public ResponseEntity<Long> countInactiveTours(@PathVariable Long guideId) {
        return ResponseEntity.ok(tourService.countToursByGuideIdAndStatus(guideId, TourStatus.INACTIVE));
    }

    @GetMapping("/guide/{guideId}/company/{companyId}/count/active")
    public ResponseEntity<Long> countActiveToursByGuideCompany(
            @PathVariable Long guideId,
            @PathVariable Long companyId) {
        return ResponseEntity.ok(
                tourService.countToursByGuideIdAndCompanyIdAndStatus(guideId, companyId, TourStatus.ACTIVE)
        );
    }

    @GetMapping("/guide/{guideId}/company/{companyId}/count/inactive")
    public ResponseEntity<Long> countInactiveToursByGuideCompany(
            @PathVariable Long guideId,
            @PathVariable Long companyId) {
        return ResponseEntity.ok(
                tourService.countToursByGuideIdAndCompanyIdAndStatus(guideId, companyId, TourStatus.INACTIVE)
        );

    }
}
