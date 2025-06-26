package com.galapass.api.DTO.user;

import lombok.Data;

@Data
public class OwnerSummaryDTO {
    private Long id;
    private String email;
    private String name;
    private String profilePhoto;
}