package com.galapass.api.mapper;

import com.galapass.api.DTO.TourCompanyDTO;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.User;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TourCompanyMapper {

    public static TourCompany toEntity(TourCompanyDTO dto, User owner) {
        return TourCompany.builder()
                .name(dto.getName())
                .owner(owner)
                .build();
    }
}
