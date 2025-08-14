package com.galapass.api.user.repository;

import com.galapass.api.user.entity.GuideDashboardStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GuideDashboardStatsRepository extends JpaRepository<GuideDashboardStats, Long> {
    Optional<GuideDashboardStats> findByGuide_Id(Long guideId);
}
