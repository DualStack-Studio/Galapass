package com.galapass.api.user.mapper;

import com.galapass.api.user.DTO.guideInvitation.GuideInvitationResponse;
import com.galapass.api.user.entity.GuideInvitation;
import org.springframework.stereotype.Component;

@Component
public class GuideInvitationMapper {

    public GuideInvitationResponse toResponse(GuideInvitation invitation) {
        return GuideInvitationResponse.builder()
                .id(invitation.getId())
                .email(invitation.getGuide().getEmail())
                .message(invitation.getMessage())
                .status(invitation.getStatus())
                .sentAt(invitation.getSentAt())
                .name(invitation.getGuide().getName())
                .company(invitation.getCompany().getName())
                .build();
    }
}
