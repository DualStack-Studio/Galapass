package com.galapass.api.tour.mapper;

import com.galapass.api.booking.repository.BookingRepository;
import com.galapass.api.media.DTO.MediaResponse;
import com.galapass.api.tour.DTO.tour.TourDetailPageDTO;
import com.galapass.api.tour.DTO.tour.TourDraftResponse;
import com.galapass.api.tour.DTO.tour.TourResponseDTO;
import com.galapass.api.tour.DTO.tour.TourResponseOwnerViewDTO;
import com.galapass.api.tour.DTO.tourCompany.TourCompanySummaryDTO;
import com.galapass.api.tour.entity.Tour;
import com.galapass.api.tour.repository.TourDateRepository;
import com.galapass.api.tour.repository.TourRepository;
import com.galapass.api.tour.repository.TourReviewRepository;
import com.galapass.api.user.mapper.UserMapper;
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
    private final TourRepository tourRepository;
    private final TourReviewMapper tourReviewMapper;
    private final TourDateRepository tourDateRepository;
    private final TourDateMapper tourDateMapper;
    private final TourCompanyMapper tourCompanyMapper;

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

        List<MediaResponse> mediaResponses = tour.getMedia().stream()
                .map(mediaEntity -> new MediaResponse(mediaEntity.getUrl(), mediaEntity.getType()))
                .toList();

        TourResponseDTO dto = new TourResponseDTO();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setCategory(tour.getCategory());
        dto.setLocation(tour.getLocation());
        dto.setDestination(tour.getDestination());
        dto.setMedia(mediaResponses);
        dto.setStatus(tour.getStatus());
        dto.setCompany(companyDTO);
        dto.setOwner(userMapper.toOwnerSummaryDTO(tour.getOwner()));
        dto.setGuides(tour.getGuides().stream()
                .map(userMapper::toGuideSummaryDTO)
                .collect(Collectors.toSet()));

        dto.setTags(tour.getTags().stream()
                .map(Enum::name)
                .collect(Collectors.toSet()));
        dto.setBrings(tour.getBrings());
        dto.setRating(averageRating);
        dto.setDuration(tour.getDuration());
        dto.setMaxGuests(tour.getMaxGuests());
        dto.setHighlights(tour.getHighlights());

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
        List<MediaResponse> mediaResponses = tour.getMedia().stream()
                .map(mediaEntity -> new MediaResponse(mediaEntity.getUrl(), mediaEntity.getType()))
                .toList();

        return TourResponseOwnerViewDTO.builder()
                .id(tour.getId())
                .title(tour.getTitle())
                .price(tour.getPrice())
                .location(tour.getLocation())
                .destination(tour.getDestination())
                .media(mediaResponses)
                .status(String.valueOf(tour.getStatus()))
                .owner(userMapper.toOwnerSummaryDTO(tour.getOwner()))
                .rating(tourReviewRepository.getAverageRatingByTourId(tour.getId()) != null
                        ? tourReviewRepository.getAverageRatingByTourId(tour.getId())
                        : 0.0)
                .reviewCount(tourReviewRepository.countByTourId(tour.getId()))
                .build();
    }
    public List<TourResponseOwnerViewDTO> toTourResponseOwnerViewDTOList(List<Tour> tours) {
        if (tours == null) {
            return null;
        }
        return tours.stream()
                .map(this::toTourResponseOwnerViewDTO)
                .collect(Collectors.toList());
    }



    public TourDraftResponse toTourDraftResponse(Tour tour) {
        return TourDraftResponse.builder()
                .id(tour.getId())
                .title(tour.getTitle())
                .category(tour.getCategory())
                .location(tour.getLocation())
                .destination(tour.getDestination())
                .build();
    }

    public TourDetailPageDTO tourDetailPageDTO(Tour tour) {
        return TourDetailPageDTO.builder()
                .id(tour.getId())
                .title(tour.getTitle())
                .description(tour.getDescription())
                .duration(tour.getDuration())
                .maxGuests(tour.getMaxGuests())
                .price(tour.getPrice())
                .location(tour.getLocation())
                .destination(tour.getDestination())
                .media(tour.getMedia().stream()
                        .map(mediaEntity -> new MediaResponse(mediaEntity.getUrl(), mediaEntity.getType()))
                        .collect(Collectors.toList()))
                .tags(tour.getTags().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()))
                .category(tour.getCategory())
                .guides(tour.getGuides().stream()
                        .map(userMapper::toGuideSummaryDTO)
                        .collect(Collectors.toSet()))
                .highlights(tour.getHighlights())
                .company(tourCompanyMapper.toTourCompanyDetailDTO(tour.getCompany()))
                .owner(userMapper.toOwnerSummaryDTO(tour.getOwner()))
                .averageRating(tourReviewRepository.getAverageRatingByTourId(tour
                        .getId()) != null
                        ? tourReviewRepository.getAverageRatingByTourId(tour.getId())
                        : 0.0)
                .totalReviews(tourReviewRepository.countByTourId(tour.getId()))
                .reviews
                        (tourReviewRepository.findByTourId(tour.getId()).stream()
                        .map(tourReviewMapper::toTourReview)
                        .collect(Collectors.toList()))
                .tourDates
                        (tourDateRepository.findByTour(tour).stream()
                        .map(tourDateMapper::toTourDateTourDetailDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}