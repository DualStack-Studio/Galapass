package com.galapass.api.user.controller;

import com.galapass.api.user.DTO.ownerDashboard.OwnerDashboardStatsResponse;
import com.galapass.api.user.service.OwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner-dashboard")
@RequiredArgsConstructor
public class OwnerDashboardController {

    private final OwnerDashboardService OwnerdashboardService;

    @GetMapping("/stats/{ownerId}")
    public ResponseEntity<OwnerDashboardStatsResponse> getOwnerDashboardStats(@PathVariable Long ownerId) {
        return ResponseEntity.ok(OwnerdashboardService.getOwnerDashboardStats(ownerId));
    }
}
