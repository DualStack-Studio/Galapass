package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.TourCompanyDTO;
import com.galapass.api.entity.Role;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.User;
import com.galapass.api.exception.EntityNotFoundException;
import com.galapass.api.mapper.TourCompanyMapper;
import com.galapass.api.repository.TourCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TourCompanyService {

    private final TourCompanyRepository tourCompanyRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<TourCompany> getAllTourCompanies() {
        return tourCompanyRepository.findAll();
    }

    public Optional<TourCompany> getTourCompanyById(Long id) {
        return tourCompanyRepository.findById(id);
    }

    public void createTourCompany(TourCompanyDTO dto) {

        User owner = userService.getUserById(dto.getOwnerId()).
                orElseThrow(() -> new EntityNotFoundException("User with Id: " + dto.getOwnerId() + " not found"));

        TourCompany tourCompany = TourCompanyMapper.toEntity(dto, owner);
        tourCompanyRepository.save(tourCompany);
        owner.setCompany(tourCompany);
        userService.updateUser(owner);
    }

    public Optional<TourCompany> updateTourCompany(TourCompany tourCompanyUpdate) {
        return tourCompanyRepository.findById(tourCompanyUpdate.getId())
                .map(existingCompany -> {
                    try {
                        objectMapper.updateValue(existingCompany, tourCompanyUpdate);
                        return tourCompanyRepository.save(existingCompany);
                    } catch (Exception e) {
                        return null;
                    }
                });
    }

    public void deleteTourCompanyById(Long id) {
        tourCompanyRepository.deleteById(id);
    }

    public void addGuideToCompany(Long companyId, Long guideId) {
        TourCompany company = tourCompanyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company with ID " + companyId + " not found"));

        User guide = userService.getUserById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide with ID " + guideId + " not found"));

        if (guide.getRole() != Role.GUIDE) {
            throw new RuntimeException("User with ID " + guideId + " is not a guide");
        }

        company.getGuides().add(guide);
        guide.setCompany(company);
        userService.updateUser(guide);
    }

}
