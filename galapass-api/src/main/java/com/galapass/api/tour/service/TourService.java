package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.DTO.tour.TourDetailPageDTO;
import com.galapass.api.DTO.tour.TourPatchRequest;
import com.galapass.api.DTO.tour.TourResponseDTO;
import com.galapass.api.entity.Location;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.media.Media;
import com.galapass.api.entity.tour.*;
import com.galapass.api.entity.user.User;
import com.galapass.api.exception.TourNotFoundException;
import com.galapass.api.mapper.TourMapper;
import com.galapass.api.repository.TourCompanyRepository;
import com.galapass.api.entity.CompanyTourStatus;

import com.galapass.api.repository.TourRepository;
import com.galapass.api.repository.TourReviewRepository;
import com.galapass.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourService {
    private final TourRepository tourRepository;
    private final TourReviewRepository tourReviewRepository;
    private final TourMapper tourMapper;
    private final TourCompanyRepository tourCompanyRepository;
    private final UserRepository userRepository;

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }


    public TourResponseDTO getTourById(Long id) {
        return tourRepository.findById(id)
                .map(tourMapper::toTourResponseDTO)
                .orElseThrow(() -> new TourNotFoundException("Tour not found with id: " + id));
    }


    public TourDetailPageDTO getTourDetailPageDTOById(Long id) {
        return tourRepository.findById(id)
                .map(tourMapper::tourDetailPageDTO)
                .orElseThrow(() -> new TourNotFoundException("Tour not found with id: " + id));
    }

    public List<Tour> getToursByCompanyId(Long companyId) {
        return tourRepository.findByCompanyId(companyId);
    }

    public Tour createTour(Tour tour) {
        return tourRepository.save(tour);
    }

    public Tour updateTour(Tour tourUpdate) {
        return tourRepository.findById(tourUpdate.getId())
                .map(existingTour -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingTour, tourUpdate);
                        return tourRepository.save(existingTour);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update tour", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Tour with ID " + tourUpdate.getId() + " not found."));
    }

    public void deleteTourById(Long id) {
        tourRepository.deleteById(id);
    }

    public double calculateAverageTourRating(Long tourId) {
        Double avg = tourReviewRepository.getAverageRatingByTourId(tourId);
        return avg != null ? avg : 0.0;
    }


    public TourResponseDTO patchTour(Long tourId, TourPatchRequest request) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + tourId));

        if (request.getTitle() != null) {
            tour.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            tour.setDescription(request.getDescription());
        }

        if (request.getPrice() != null) {
            tour.setPrice(request.getPrice());
        }

        if (request.getCategory() != null) {
            try {
                TourCategory categoryEnum = TourCategory.valueOf(request.getCategory().toUpperCase());
                tour.setCategory(categoryEnum);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid category: " + request.getCategory());
            }
        }

        if (request.getLocation() != null) {
            try {
                tour.setLocation(Location.valueOf(request.getLocation()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid location: " + request.getLocation());
            }
        }

        if (request.getMedia() != null) {
            // 1. Clear the existing collection of media entities.
            tour.getMedia().clear();

            // 2. Map the new incoming media data from the request to new Media entities.
            if (!request.getMedia().isEmpty()) {
                List<Media> newMediaEntities = request.getMedia().stream()
                        .map(mediaRequest -> {
                            Media mediaEntity = new Media();
                            mediaEntity.setUrl(mediaRequest.getUrl());
                            mediaEntity.setType(mediaRequest.getType());
                            mediaEntity.setDisplayOrder(mediaRequest.getDisplayOrder());
                            mediaEntity.setTour(tour);
                            return mediaEntity;
                        })
                        .toList();

                // 3. Add the new collection of media entities to the tour.
                tour.getMedia().addAll(newMediaEntities);
            }
        }

        if (request.getStatus() != null) {
            try {
                com.galapass.api.entity.CompanyTourStatus status = com.galapass.api.entity.CompanyTourStatus.valueOf(request.getStatus().toUpperCase());
                tour.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + request.getStatus());
            }
        }

        if (request.getDuration() != null) {
            try {
                Duration durationEnum = Duration.valueOf(request.getDuration());
                tour.setDuration(durationEnum);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid duration: " + request.getDuration());
            }
        }

        if (request.getMaxGuests() != null) {
            tour.setMaxGuests(request.getMaxGuests());
        }

        if (request.getHighlights() != null) {
            tour.setHighlights(request.getHighlights());
        }

        if (request.getTags() != null) {
            Set<TourTag> tags = request.getTags().stream()
                    .map(tag -> {
                        try {
                            return TourTag.valueOf(tag.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new RuntimeException("Invalid tag: " + tag);
                        }
                    })
                    .collect(Collectors.toSet());
            tour.setTags(tags);
        }

        if (request.getBrings() != null) {
            List<Bring> brings = request.getBrings().stream()
                    .map(bring -> {
                        try {
                            return Bring.valueOf(bring);
                        } catch (IllegalArgumentException e) {
                            throw new RuntimeException("Invalid bring: " + bring);
                        }
                    })
                    .collect(Collectors.toList());
            tour.setBrings(brings);
        }

        // Update company
        if (request.getCompany() != null && request.getCompany().getId() != null) {
            TourCompany company = tourCompanyRepository.findById(request.getCompany().getId())
                    .orElseThrow(() -> new RuntimeException("Company not found with id: " + request.getCompany().getId()));
            tour.setCompany(company);
        }

        // Update guides
        if (request.getGuides() != null && !request.getGuides().isEmpty()) {
            Set<User> guideUsers = request.getGuides().stream()
                    .map(guideDto -> {
                        if (guideDto.getId() == null)
                            throw new RuntimeException("Guide ID missing");
                        return userRepository.findById(guideDto.getId())
                                .orElseThrow(() -> new RuntimeException("Guide not found: " + guideDto.getId()));
                    })
                    .collect(Collectors.toSet());
            tour.setGuides(guideUsers);
        }

        // update owner
        if (request.getOwner() != null && request.getOwner().getId() != null) {
            User owner = userRepository.findById(request.getOwner().getId())
                    .orElseThrow(() -> new RuntimeException("Owner not found with id: " + request.getOwner().getId()));
            tour.setOwner(owner);
        }

        Tour updated = tourRepository.save(tour);
        return tourMapper.toTourResponseDTO(updated);
    }


    public List<Tour> getActiveToursByGuideId(Long guideId) {
        return tourRepository.findToursByGuideIdAndStatus(guideId, CompanyTourStatus.ACTIVE);
    }

    public List<Tour> getInactiveToursByGuideId(Long guideId) {
        return tourRepository.findToursByGuideIdAndStatus(guideId, CompanyTourStatus.INACTIVE);
    }

    public Long countToursByGuideIdAndStatus(Long guideId, CompanyTourStatus status) {
        return tourRepository.countToursByGuideIdAndStatus(guideId, status);
    }

    public Long countToursByGuideIdAndCompanyIdAndStatus(Long guideId, Long companyId, CompanyTourStatus status) {
        return tourRepository.countToursByGuideIdAndCompanyId(guideId, companyId, status);
    }
}
