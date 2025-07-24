package com.galapass.api.DTO.tourCompany;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourCompanyEditing {
    private Long id;
    private String name;
    private String status;
    private String description;
    private String location;
    private String logo;
    private String phone;
    private String email;
}
