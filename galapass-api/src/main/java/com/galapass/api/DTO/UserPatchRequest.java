package com.galapass.api.DTO;

import lombok.Data;

@Data
public class UserPatchRequest {
    private String name;
    private String email;
    private String password;
    private String bio;
    private String language;
    private String profilePhoto;
}