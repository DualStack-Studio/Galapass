package com.galapass.api.mapper;

import com.galapass.api.DTO.CompanySummaryDTO;
import com.galapass.api.DTO.TourResponseDTO;
import com.galapass.api.DTO.UserSummaryDTO;
import com.galapass.api.entity.Tour;
import com.galapass.api.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourMapper {

    public UserSummaryDTO toUserSummaryDTO(User user) {
        if (user == null) {
            return null;
        }
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setProfilePhoto(user.getProfilePhoto());
        return dto;
    }

    public TourResponseDTO toTourResponseDTO(Tour tour) {
        if (tour == null) {
            return null;
        }

        CompanySummaryDTO companyDTO = new CompanySummaryDTO();
        companyDTO.setId(tour.getCompany().getId());
        companyDTO.setName(tour.getCompany().getName());

        TourResponseDTO dto = new TourResponseDTO();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setCategory(tour.getCategory());
        dto.setLocation(tour.getLocation());
        dto.setPhotoUrl(tour.getPhotoUrl());
        dto.setCompany(companyDTO);
        dto.setOwner(toUserSummaryDTO(tour.getOwner()));
        dto.setGuides(tour.getGuides().stream()
                .map(this::toUserSummaryDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    public List<TourResponseDTO> toTourResponseDTOList(List<Tour> tours) {
        if (tours == null) {
            return null;
        }
        return tours.stream()
                .map(this::toTourResponseDTO)
                .collect(Collectors.toList());
    }
}