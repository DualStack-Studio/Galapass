package com.galapass.api.DTO.tourCompany;

import com.galapass.api.DTO.user.OwnerSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.galapass.api.DTO.user.GuideSummaryDTO;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourCompanyBasicDTO {
    private Long id;
    private String name;
    private List<GuideSummaryDTO> guides;
}
