package com.galapass.api.mapper;

import com.galapass.api.DTO.tourCompany.TourCompanyResponse;
import com.galapass.api.entity.TourCompany;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TourCompanyMapper {

    private final UserMapper userMapper;
    private final TourMapper tourMapper;

    public TourCompanyResponse toTourCompanyResponse(TourCompany company) {
        return TourCompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .status(String.valueOf(company.getStatus()))
                .owner(userMapper.toOwnerSummaryDTO(company.getOwner()))
                .guides(company.getGuides().stream()
                        .map(userMapper::toGuideSummaryDTO)
                        .toList())
                .tours(company.getTours().stream()
                        .map(tourMapper::toTourResponseOwnerViewDTO)
                        .toList())
                .build();
    }
}
