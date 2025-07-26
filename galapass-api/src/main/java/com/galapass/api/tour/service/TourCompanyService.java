package com.galapass.api.tour.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.exception.EntityNotFoundException;
import com.galapass.api.tour.DTO.tourCompany.*;
import com.galapass.api.tour.entity.CompanyTourStatus;
import com.galapass.api.tour.entity.TourCompany;
import com.galapass.api.tour.mapper.TourCompanyMapper;
import com.galapass.api.tour.repository.TourCompanyRepository;
import com.galapass.api.user.DTO.user.UserResponse;
import com.galapass.api.user.entity.Role;
import com.galapass.api.user.entity.User;
import com.galapass.api.user.mapper.UserMapper;
import com.galapass.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public List<TourCompanyResponse> getCompaniesByGuideId(Long guideId) {
        return tourCompanyRepository.findAllByGuideId(guideId).stream()
                .map(tourCompanyMapper::toTourCompanyResponse)
                .toList();
    }


    public TourCompanyEditing getTourCompanyById(Long id) {
        TourCompany tourCompany = tourCompanyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour company not found with id: " + id));

        // Perform the mapping here
        return tourCompanyMapper.toEditingDTO(tourCompany);
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

        // ✅ Add guide to company and company to guide
        company.getGuides().add(guide);
        guide.getCompanies().add(company);

        // ✅ Save both sides if needed
        tourCompanyRepository.save(company);
        userService.updateUser(guide);
    }

    public void removeGuideFromCompany(Long companyId, Long guideId) {
        TourCompany company = tourCompanyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company with ID " + companyId + " not found"));

        User guide = userService.getUserById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide with ID " + guideId + " not found"));

        if (!company.getGuides().contains(guide)) {
            throw new RuntimeException("Guide with ID " + guideId + " is not assigned to company with ID " + companyId);
        }

        // ✅ Remove both sides of the relationship
        company.getGuides().remove(guide);
        guide.getCompanies().remove(company);

        // ✅ Save changes
        tourCompanyRepository.save(company);
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

    public TourCompanyResponse patchCompany(Long companyId, TourCompanyPatchRequest request) {
        TourCompany company = tourCompanyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));

        if (request.getName() != null) {
            company.setName(request.getName());
        }

        if (request.getLocation() != null) {
            company.setLocation(request.getLocation());
        }

        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }

        if (request.getPhone() != null) {
            company.setPhone(request.getPhone());
        }

        if (request.getEmail() != null) {
            company.setEmail(request.getEmail());
        }

        if (request.getLogo() != null) {
            company.setLogo(request.getLogo());
        }

        if (request.getStatus() != null) {
            company.setStatus(CompanyTourStatus.valueOf(request.getStatus().toUpperCase()));
        }

        TourCompany tourCompany = tourCompanyRepository.save(company);
        return tourCompanyMapper.toTourCompanyResponse(tourCompany);
    }
}
