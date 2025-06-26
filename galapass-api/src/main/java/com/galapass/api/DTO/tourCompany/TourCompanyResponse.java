package com.galapass.api.DTO.tourCompany;

import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.DTO.user.GuideSummaryDTO;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import com.galapass.api.DTO.user.UserResponse;
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
    private OwnerSummaryDTO owner;
    private List<GuideSummaryDTO> guides;
    private List<TourResponseOwnerViewDTO> tours;
}
