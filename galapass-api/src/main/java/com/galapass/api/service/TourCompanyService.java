package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.tourCompany.TourCompanyBasicDTO;
import com.galapass.api.DTO.tourCompany.TourCompanyCreateRequest;
import com.galapass.api.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.CompanyTourStatus;
import com.galapass.api.entity.user.Role;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.user.User;
import com.galapass.api.exception.EntityNotFoundException;
import com.galapass.api.mapper.TourCompanyMapper;
import com.galapass.api.mapper.UserMapper;
import com.galapass.api.repository.TourCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourCompanyService {

    private final TourCompanyRepository tourCompanyRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final TourCompanyMapper tourCompanyMapper;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    public List<TourCompanyResponse> getAllTourCompanies() {
        return tourCompanyRepository.findAll().stream()
                .map(tourCompanyMapper::toTourCompanyResponse)
                .toList();
    }

    public List<TourCompanyResponse> getCompaniesByOwnerId(Long ownerId) {
        return tourCompanyRepository.findAllByOwner_Id(ownerId).stream()
                .map(tourCompanyMapper::toTourCompanyResponse)
                .toList();
    }

    public Optional<TourCompany> getTourCompanyById(Long id) {
        return tourCompanyRepository.findById(id);
    }

    public void createTourCompany(TourCompanyCreateRequest dto) {
        User owner = userService.getUserById(dto.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (owner.getRole() != Role.OWNER) {
            throw new RuntimeException("Only owners can create a company.");
        }

        TourCompany company = TourCompany.builder()
                .name(dto.getName())
                .owner(owner)
                .status(CompanyTourStatus.ACTIVE)
                .description(dto.getDescription())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .logo(dto.getLogo())
                .location(dto.getLocation())
                .build();

        tourCompanyRepository.save(company);
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

    public List<UserResponse> getGuidesByCompany(Long companyId) {
        TourCompany company = tourCompanyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + companyId));

        return company.getGuides().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public List<TourCompanyBasicDTO> getAllCompaniesBasic(Long ownerId) {
        return tourCompanyRepository.findAllByOwner_Id(ownerId).stream()
                .map(tourCompanyMapper::toBasicDTO)
                .toList();
    }

    public void removeGuideFromCompany(Long companyId, Long guideId) {
        TourCompany company = tourCompanyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company with ID " + companyId + " not found"));

        User guide = userService.getUserById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide with ID " + guideId + " not found"));

        if (guide.getRole() != Role.GUIDE) {
            throw new RuntimeException("User with ID " + guideId + " is not a guide");
        }

        if (!company.getGuides().contains(guide)) {
            throw new RuntimeException("Guide with ID " + guideId + " is not part of the company with ID " + companyId);
        }

        company.getGuides().remove(guide);
        guide.setCompany(null);
        userService.updateUser(guide);
    }

}
