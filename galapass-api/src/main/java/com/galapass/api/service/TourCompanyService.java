package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.TourCompanyDTO;
import com.galapass.api.entity.Role;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.User;
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

    public Optional<TourCompany> createTourCompany(TourCompanyDTO dto) {
        Optional<User> ownerOpt = userService.getUserById(dto.getOwnerId());

        if (ownerOpt.isEmpty()) return Optional.empty();

        User owner = ownerOpt.get();

        if (owner.getRole() != Role.OWNER) return Optional.empty();

        TourCompany tourCompany = TourCompanyMapper.toEntity(dto, owner);

        return Optional.of(tourCompanyRepository.save(tourCompany));
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
}
