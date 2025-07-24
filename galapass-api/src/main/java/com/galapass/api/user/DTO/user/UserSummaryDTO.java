package com.galapass.api.user.DTO.user;

import lombok.Data;

@Data
public class UserSummaryDTO {
    private Long id;
    private String email;
    private String name;
    private String profilePhoto;
}