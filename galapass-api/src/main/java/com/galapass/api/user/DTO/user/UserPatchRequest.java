package com.galapass.api.user.DTO.user;

import lombok.Data;

@Data
public class UserPatchRequest {
    private String name;
    private String email;
    private String role;
    private String password;
    private String bio;
    private String language;
    private String profilePhoto;
    private String status;
}