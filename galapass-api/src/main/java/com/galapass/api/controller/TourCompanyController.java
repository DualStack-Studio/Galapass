package com.galapass.api.controller;

import com.galapass.api.DTO.TourCompanyDTO;
import com.galapass.api.entity.Role;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.User;
import com.galapass.api.service.TourCompanyService;
import com.galapass.api.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Tour Company API", description = "Tour Company API")
public class TourCompanyController {

    private final TourCompanyService tourCompanyService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TourCompany>> getAllTourCompanies() {
        return ResponseEntity.ok(tourCompanyService.getAllTourCompanies());
    }

    @PostMapping
    public ResponseEntity<?> createTourCompany(@RequestBody TourCompanyDTO tourCompany) {
        try {
            tourCompanyService.createTourCompany(tourCompany);
            return ResponseEntity.ok(tourCompany);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<TourCompany>> getTourCompanyById(@PathVariable Long id) {
        System.out.println(tourCompanyService.getTourCompanyById(id).get().getGuides());
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
    public ResponseEntity<String> addGuideToCompany(@PathVariable Long companyId, @PathVariable Long guideId) {
        Optional<TourCompany> company = tourCompanyService.getTourCompanyById(companyId);
        Optional<User> guide = userService.getUserById(guideId);

        if (company.isEmpty()) {
            return ResponseEntity.badRequest().body("Company with ID " + companyId + " not found");
        }
        if (guide.isEmpty()) {
            return ResponseEntity.badRequest().body("Guide with ID " + guideId + " not found");
        }
        if (guide.get().getRole() != Role.GUIDE) {
            return ResponseEntity.badRequest().body("UserID with ID" + guideId + "is not a guide, please enter a guide id");
        }

        company.get().getGuides().add(guide.get());
        guide.get().setCompany(company.get());
        userService.updateUser(guide.get());
        return ResponseEntity.ok("Guide added to company");
    }

}
