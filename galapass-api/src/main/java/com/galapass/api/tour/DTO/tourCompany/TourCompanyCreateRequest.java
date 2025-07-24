package com.galapass.api.tour.DTO.tourCompany;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourCompanyCreateRequest {
    private String name;
    private Long ownerId;
    private String phone;
    private String email;
    private String description;
    private String logo;
    private String location;
}
