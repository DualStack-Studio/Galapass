package com.galapass.api.tour.controller;

import com.galapass.api.exception.EntityNotFoundException;
import com.galapass.api.tour.DTO.tour.TourResponseDTO;
import com.galapass.api.tour.DTO.tourCompany.*;
import com.galapass.api.tour.entity.Tour;
import com.galapass.api.tour.entity.TourCompany;
import com.galapass.api.tour.mapper.TourMapper;
import com.galapass.api.tour.service.TourCompanyService;
import com.galapass.api.tour.service.TourService;
import com.galapass.api.user.DTO.user.UserResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Tour Company API", description = "Tour Company API")
public class TourCompanyController {

    private final TourCompanyService tourCompanyService;
    private final TourService tourService;
    private final TourMapper tourMapper;

    @GetMapping
    public ResponseEntity<List<TourCompanyResponse>> getAllTourCompanies() {
        return ResponseEntity.ok(tourCompanyService.getAllTourCompanies());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<?> createTourCompany(@RequestBody TourCompanyCreateRequest tourCompany) {
        try {
            tourCompanyService.createTourCompany(tourCompany);
            return ResponseEntity.ok(tourCompany);

        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Database constraint violated. Check server logs for the real cause. Message: " + e.getRootCause().getMessage());

    
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourCompanyEditing> getTourCompaniesById(@PathVariable Long id) {
        return ResponseEntity.ok(tourCompanyService.getTourCompanyById(id));
    }

    @PutMapping
    public ResponseEntity<Optional<TourCompany>> updateTourCompany(@RequestBody TourCompany tourCompany) {
        return ResponseEntity.ok(tourCompanyService.updateTourCompany(tourCompany));
    }

    @DeleteMapping("/{id}")
    public void deleteTourCompanyById(@PathVariable Long id) {
        tourCompanyService.deleteTourCompanyById(id);
    }

    @PostMapping("/{companyId}/guides/{guideId}")
    public ResponseEntity<?> addGuideToCompany(@PathVariable Long companyId, @PathVariable Long guideId) {
        try {
            tourCompanyService.addGuideToCompany(companyId, guideId);
            return ResponseEntity.ok("Guide added to company");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{companyId}/guides/{guideId}")
    public ResponseEntity<?> removeGuideFromCompany(@PathVariable Long companyId, @PathVariable Long guideId) {
        try {
            tourCompanyService.removeGuideFromCompany(companyId, guideId);
            return ResponseEntity.ok("Guide removed from company");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{companyId}/tours")
    public ResponseEntity<List<TourResponseDTO>> getToursByCompany(@PathVariable Long companyId) {
        List<Tour> tours = tourService.getToursByCompanyId(companyId);
        return ResponseEntity.ok(tourMapper.toTourResponseDTOList(tours));
    }

    @GetMapping("/{companyId}/guides")
    public ResponseEntity<List<UserResponse>> getGuidesByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(tourCompanyService.getGuidesByCompany(companyId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<TourCompanyResponse>> getCompaniesByOwnerId(@PathVariable Long ownerId) {
        return ResponseEntity.ok(tourCompanyService.getCompaniesByOwnerId(ownerId));
    }

    @GetMapping("/basic-owner/{ownerId}")
    public List<TourCompanyBasicDTO> getAllBasicCompanies(@PathVariable Long ownerId) {
        return tourCompanyService.getAllCompaniesBasic(ownerId);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchCompany(@PathVariable Long id, @RequestBody TourCompanyPatchRequest request) {
        try {
            TourCompanyResponse updatedCompany = tourCompanyService.patchCompany(id, request);
            return ResponseEntity.ok(updatedCompany);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
