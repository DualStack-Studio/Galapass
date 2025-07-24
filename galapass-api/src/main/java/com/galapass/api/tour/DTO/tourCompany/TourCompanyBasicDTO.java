package com.galapass.api.tour.DTO.tourCompany;

import com.galapass.api.user.DTO.user.GuideSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourCompanyBasicDTO {
    private Long id;
    private String name;
    private List<GuideSummaryDTO> guides;
}
