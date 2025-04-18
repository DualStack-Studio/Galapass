package com.galapass.api.controller;

import com.galapass.api.entity.TourCompany;
import com.galapass.api.service.TourCompanyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tour-companies")
@RequiredArgsConstructor
@Tag(name = "Tour Company API", description = "Tour Company API")
public class TourCompanyController {

    private final TourCompanyService tourCompanyService;

    @GetMapping
    public ResponseEntity<List<TourCompany>> getAllTourCompanies() {
        return ResponseEntity.ok(tourCompanyService.getAllTourCompanies());
    }

    @PostMapping
    public ResponseEntity<TourCompany> createTourCompany(@RequestBody TourCompany tourCompany) {
        return ResponseEntity.ok(tourCompanyService.createTourCompany(tourCompany));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourCompany> getTourCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(tourCompanyService.getTourCompanyById(id));
    }

    @PutMapping
    public ResponseEntity<TourCompany> updateTourCompany(@RequestBody TourCompany tourCompany) {
        return ResponseEntity.ok(tourCompanyService.updateTourCompany(tourCompany));
    }

    @DeleteMapping("/{id}")
    public void deleteTourCompanyById(@PathVariable Long id) {
        tourCompanyService.deleteTourCompanyById(id);
    }
}
