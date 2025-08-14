package com.galapass.api.user.service;

import com.galapass.api.user.DTO.guideDashboard.GuideDashboardStatsDTO;
import com.galapass.api.user.entity.GuideDashboardStats;
import com.galapass.api.user.entity.Role;
import com.galapass.api.user.entity.User;
import com.galapass.api.user.repository.GuideDashboardStatsRepository;
import com.galapass.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class GuideDashboardStatsService {

    private final GuideDashboardStatsRepository statsRepository;
    private final UserRepository userRepository;

    public GuideDashboardStatsDTO getStats(Long guideId) {
        return statsRepository.findByGuide_Id(guideId)
                .map(stats -> new GuideDashboardStatsDTO(
                        stats.getActiveToursCount(),
                        stats.getUpcomingToursCount(),
                        stats.getCompletedToursCount(),
                        stats.getAverageRating(),
                        stats.getTotalEarnings()
                ))
                .orElse(null);
    }

    public GuideDashboardStatsDTO patchStats(Long guideId, GuideDashboardStatsDTO partialDto) {
        User guide = userRepository.findById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide not found"));

        if (guide.getRole() != Role.GUIDE) {
            throw new RuntimeException("User is not a guide");
        }

        GuideDashboardStats stats = statsRepository.findByGuide_Id(guideId)
                .orElseGet(() -> {
                    GuideDashboardStats newStats = new GuideDashboardStats();
                    newStats.setGuide(guide);
                    // inicializa con ceros o valores default
                    newStats.setActiveToursCount(0);
                    newStats.setUpcomingToursCount(0);
                    newStats.setCompletedToursCount(0);
                    newStats.setAverageRating(0);
                    newStats.setTotalEarnings(BigDecimal.ZERO);
                    return newStats;
                });

        // Actualizar solo si no es null en el DTO
        if (partialDto.getActiveToursCount() != 0) {
            stats.setActiveToursCount(partialDto.getActiveToursCount());
        }
        if (partialDto.getUpcomingToursCount() != 0) {
            stats.setUpcomingToursCount(partialDto.getUpcomingToursCount());
        }
        if (partialDto.getCompletedToursCount() != 0) {
            stats.setCompletedToursCount(partialDto.getCompletedToursCount());
        }
        if (partialDto.getAverageRating() != 0) {
            stats.setAverageRating(partialDto.getAverageRating());
        }
        if (partialDto.getTotalEarnings() != null && partialDto.getTotalEarnings().compareTo(BigDecimal.ZERO) != 0) {
            stats.setTotalEarnings(partialDto.getTotalEarnings());
        }

        GuideDashboardStats saved = statsRepository.save(stats);

        return new GuideDashboardStatsDTO(
                saved.getActiveToursCount(),
                saved.getUpcomingToursCount(),
                saved.getCompletedToursCount(),
                saved.getAverageRating(),
                saved.getTotalEarnings()
        );
    }

}
