package com.galapass.api.controller;

import com.galapass.api.DTO.guideInvitation.GuideInvitationRequest;
import com.galapass.api.DTO.guideInvitation.GuideInvitationResponse;
import com.galapass.api.entity.user.GuideInvitation;
import com.galapass.api.mapper.GuideInvitationMapper;
import com.galapass.api.service.GuideInvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class GuideInvitationController {

    private final GuideInvitationService service;
    private final GuideInvitationMapper mapper;
    private final GuideInvitationService guideInvitationService;

    @PostMapping
    public GuideInvitationResponse createInvitation(@RequestBody GuideInvitationRequest request) {
        GuideInvitation invitation = service.createInvitation(request);
        return mapper.toResponse(invitation);
    }

    @GetMapping("/company/{companyId}")
    public List<GuideInvitationResponse> getInvitationsByCompany(@PathVariable Long companyId) {
        return service.getInvitationsByCompany(companyId)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void cancelInvitation(@PathVariable Long id) {
        service.cancelInvitation(id);
    }

    @PostMapping("/resend/{id}")
    public GuideInvitationResponse resendInvitation(@PathVariable Long id) {
        GuideInvitation invitation = service.resendInvitation(id);
        return mapper.toResponse(invitation);
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable Long invitationId) {
        try {
            guideInvitationService.acceptInvitation(invitationId);
            return ResponseEntity.ok("Invitation accepted and guide added to company");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{invitationId}/decline")
    public ResponseEntity<?> declineInvitation(@PathVariable Long invitationId) {
        guideInvitationService.declineInvitation(invitationId);
        return ResponseEntity.ok("Invitation declined");
    }
}
