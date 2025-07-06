package com.galapass.api.DTO.tourCompany;

import lombok.Data;

@Data
public class TourCompanyPatchRequest {
    private String name;
    private String location;
    private String description;
    private String phone;
    private String email;
    private String logo;
    private String status;
}
