package com.galapass.api.tour.DTO.tourCompany;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TourCompanyTourDetailDTO {
    private Long id;
    private String name;
    private String logo;
}
