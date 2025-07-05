package com.galapass.api.DTO.tour;

import com.galapass.api.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.DTO.user.GuideSummaryDTO;
import com.galapass.api.DTO.user.OwnerSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TourResponseOwnerViewDTO {
    private Long id;
    private String title;
    private String location;
    private Double price;
    private List<String> photoUrls;

    private OwnerSummaryDTO owner;
    private double rating;
    private long totalBookings;
    private String status;
}
