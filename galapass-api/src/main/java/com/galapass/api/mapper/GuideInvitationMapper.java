package com.galapass.api.mapper;

import com.galapass.api.DTO.guideInvitation.GuideInvitationResponse;
import com.galapass.api.entity.user.GuideInvitation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GuideInvitationMapper {

    public GuideInvitationResponse toResponse(GuideInvitation invitation) {
        GuideInvitationResponse.GuideInvitationResponseBuilder builder = GuideInvitationResponse.builder()
                .id(invitation.getId())
                .email(invitation.getGuide().getEmail())
                .message(invitation.getMessage())
                .status(invitation.getStatus())
                .sentAt(invitation.getSentAt());

        if (invitation.getCompany() != null) {
            builder.company(
                    GuideInvitationResponse.CompanyInfo.builder()
                            .id(invitation.getCompany().getId())
                            .name(invitation.getCompany().getName())
                            .email(invitation.getCompany().getEmail())
                            .logo(invitation.getCompany().getLogo()) // opcional
                            .build()
            );
        }

        return builder.build();
    }
}
