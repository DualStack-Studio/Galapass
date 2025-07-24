package com.galapass.api.tour.mapper;

import com.galapass.api.tour.DTO.tourCompany.TourCompanyBasicDTO;
import com.galapass.api.tour.DTO.tourCompany.TourCompanyEditing;
import com.galapass.api.tour.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.tour.DTO.tourCompany.TourCompanyTourDetailDTO;
import com.galapass.api.tour.entity.TourCompany;
import com.galapass.api.user.mapper.UserMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class TourCompanyMapper {

    private final UserMapper userMapper;
    private final TourMapper tourMapper;

    public TourCompanyMapper(UserMapper userMapper, @Lazy TourMapper tourMapper) {
        this.userMapper = userMapper;
        this.tourMapper = tourMapper;
    }

    public TourCompanyResponse toTourCompanyResponse(TourCompany company) {
        return TourCompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .status(String.valueOf(company.getStatus()))
                .owner(userMapper.toOwnerSummaryDTO(company.getOwner()))
                .description(company.getDescription())
                .email(company.getEmail())
                .phone(company.getPhone())
                .logo(company.getLogo())
                .location(company.getLocation())
                .guides(company.getGuides().stream()
                        .map(userMapper::toGuideSummaryDTO)
                        .toList())
                .tours(company.getTours().stream()
                        .map(tourMapper::toTourResponseOwnerViewDTO)
                        .toList())
                .build();
    }

    public TourCompanyBasicDTO toBasicDTO(TourCompany company) {
        return TourCompanyBasicDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .guides(company.getGuides().stream()
                        .map(userMapper::toGuideSummaryDTO)
                        .toList())
                .build();
    }

    public TourCompanyEditing toEditingDTO(TourCompany company) {
        return TourCompanyEditing.builder()
                .id(company.getId())
                .name(company.getName())
                .status(String.valueOf(company.getStatus()))
                .description(company.getDescription())
                .email(company.getEmail())
                .phone(company.getPhone())
                .logo(company.getLogo())
                .location(company.getLocation())
                .build();
    }

    public TourCompanyTourDetailDTO toTourCompanyDetailDTO(TourCompany company) {
        return TourCompanyTourDetailDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .logo(company.getLogo())
                .build();
    }

}
