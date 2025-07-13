package com.galapass.api.DTO.user;

import com.galapass.api.DTO.tourCompany.TourCompanySummaryDTO;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCompaniesDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String profilePhoto;
    private String bio;
    private String language;
    private Set<TourCompanySummaryDTO> companies;
}
