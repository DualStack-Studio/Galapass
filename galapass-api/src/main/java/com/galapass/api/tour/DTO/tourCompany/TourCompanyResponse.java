package com.galapass.api.tour.DTO.tourCompany;

import com.galapass.api.tour.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import com.galapass.api.user.DTO.user.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourCompanyResponse {
    private Long id;
    private String name;
    private String status;
    private UserSummaryDTO owner;
    private String description;
    private String location;
    private String logo;
    private String phone;
    private String email;
    private List<GuideSummaryDTO> guides;
    private List<TourResponseOwnerViewDTO> tours;
}
