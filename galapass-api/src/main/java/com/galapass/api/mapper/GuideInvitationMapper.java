package com.galapass.api.mapper;

import com.galapass.api.DTO.guideInvitation.GuideInvitationResponse;
import com.galapass.api.entity.user.GuideInvitation;
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
                .build();
    }
}
