package com.galapass.api.controller;

import com.galapass.api.DTO.TourCompanyDTO;
import com.galapass.api.entity.Role;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.User;
import com.galapass.api.exception.EntityNotFoundException;
import com.galapass.api.service.TourCompanyService;
import com.galapass.api.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.hibernate.tool.schema.spi.SqlScriptException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
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

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Error: companies already exist with the same name.");

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong.");
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
    public ResponseEntity<?> addGuideToCompany(@PathVariable Long companyId, @PathVariable Long guideId) {
        try {
            tourCompanyService.addGuideToCompany(companyId, guideId);
            return ResponseEntity.ok("Guide added to company");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
