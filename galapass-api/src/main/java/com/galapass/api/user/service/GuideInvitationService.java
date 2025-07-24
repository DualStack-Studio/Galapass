package com.galapass.api.user.service;

import com.galapass.api.tour.controller.TourCompanyController;
import com.galapass.api.tour.entity.TourCompany;
import com.galapass.api.tour.repository.TourCompanyRepository;
import com.galapass.api.user.DTO.guideInvitation.GuideInvitationRequest;
import com.galapass.api.user.entity.GuideInvitation;
import com.galapass.api.user.entity.InvitationStatus;
import com.galapass.api.user.entity.User;
import com.galapass.api.user.repository.GuideInvitationRepository;
import com.galapass.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GuideInvitationService {

    private final GuideInvitationRepository invitationRepository;
    private final TourCompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final TourCompanyController tourCompanyController;

    public GuideInvitation createInvitation(GuideInvitationRequest request) {
        TourCompany company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        User guide = userRepository.findById(request.getGuideId())
                .orElseThrow(() -> new RuntimeException("Guide not found"));

        GuideInvitation invitation = GuideInvitation.builder()
                .company(company)
                .guide(guide)
                .message(request.getMessage())
                .status(InvitationStatus.PENDING)
                .sentAt(ZonedDateTime.now())
                .build();

        return invitationRepository.save(invitation);
    }

    public List<GuideInvitation> getInvitationsByCompany(Long companyId) {
        return invitationRepository.findByCompanyId(companyId);
    }

    public List<GuideInvitation> getInvitationsByOwner(Long ownerId) {
        return invitationRepository.findByCompany_Owner_Id(ownerId);
    }

    public void cancelInvitation(Long id) {
        invitationRepository.deleteById(id);
    }

    public GuideInvitation resendInvitation(Long id) {
        GuideInvitation invitation = invitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setSentAt(ZonedDateTime.now());

        return invitationRepository.save(invitation);
    }

    public void acceptInvitation(Long invitationId) {
        GuideInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation is not pending");
        }

        // Add guide to company
        tourCompanyController.addGuideToCompany(invitation.getCompany().getId(), invitation.getGuide().getId());

        // Update invitation status
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);
    }

    public void declineInvitation(Long invitationId) {
        GuideInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation is not pending");
        }

        invitation.setStatus(InvitationStatus.DECLINED);
        invitationRepository.save(invitation);
    }

    public List<GuideInvitation> getInvitationsByGuideId(Long guideId) {
        return invitationRepository.findByGuideId(guideId);
    }

    public List<GuideInvitation> getPendingInvitationsByGuideId(Long guideId) {
        return invitationRepository.findByGuideIdAndStatus(guideId, InvitationStatus.PENDING);
    }

}
