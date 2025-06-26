package com.galapass.api.mapper;

import com.galapass.api.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.repository.BookingRepository;
import com.galapass.api.repository.TourReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class TourMapper {

    private final UserMapper userMapper;
    private final TourReviewRepository tourReviewRepository;
    private final BookingRepository bookingRepository;

    public TourResponseDTO toTourResponseDTO(Tour tour) {
        if (tour == null) {
            return null;
        }

        TourCompanySummaryDTO companyDTO = new TourCompanySummaryDTO();
        companyDTO.setId(tour.getCompany().getId());
        companyDTO.setName(tour.getCompany().getName());

        double averageRating = tourReviewRepository.getAverageRatingByTourId(tour.getId()) != null
                ? tourReviewRepository.getAverageRatingByTourId(tour.getId())
                : 0.0;

        TourResponseDTO dto = new TourResponseDTO();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setCategory(tour.getCategory());
        dto.setLocation(tour.getLocation());
        dto.setPhotoUrl(tour.getPhotoUrl());
        dto.setCompany(companyDTO);
        dto.setOwner(userMapper.toOwnerSummaryDTO(tour.getOwner()));
        dto.setGuides(tour.getGuides().stream()
                .map(userMapper::toGuideSummaryDTO)
                .collect(Collectors.toSet()));

        dto.setTags(tour.getTags().stream()
                .map(Enum::name)
                .collect(Collectors.toSet()));

        dto.setRating(averageRating);

        return dto;
    }

    public List<TourResponseDTO> toTourResponseDTOList(List<Tour> tours) {
        if (tours == null) {
            return null;
        }
        return tours.stream()
                .map(this::toTourResponseDTO)
                .collect(Collectors.toList());
    }

    public TourResponseOwnerViewDTO toTourResponseOwnerViewDTO(Tour tour) {
        return TourResponseOwnerViewDTO.builder()
                .id(tour.getId())
                .title(tour.getTitle())
                .price(tour.getPrice())
                .photoUrl(tour.getPhotoUrl())
                .status(String.valueOf(tour.getStatus()))
                .owner(userMapper.toOwnerSummaryDTO(tour.getOwner()))
                .rating(tourReviewRepository.getAverageRatingByTourId(tour.getId()) != null
                        ? tourReviewRepository.getAverageRatingByTourId(tour.getId())
                        : 0.0)
                .totalBookings(bookingRepository.countBookingsByTourId(tour.getId()))
                .build();
    }

    public TourResponseOwnerViewDTO toTourOwnerViewDTO(Tour tour) {
        if (tour == null) return null;

        TourResponseOwnerViewDTO dto = new TourResponseOwnerViewDTO();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setPrice(tour.getPrice());
        dto.setPhotoUrl(tour.getPhotoUrl());
        dto.setOwner(userMapper.toOwnerSummaryDTO(tour.getOwner()));
        dto.setRating(tour.getReviews() != null && !tour.getReviews().isEmpty()
                ? tour.getReviews().stream().mapToDouble(r -> r.getRating()).average().orElse(0.0)
                : 0.0);
        return dto;
    }

}