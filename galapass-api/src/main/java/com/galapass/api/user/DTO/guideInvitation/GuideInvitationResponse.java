package com.galapass.api.user.DTO.guideInvitation;

import com.galapass.api.user.entity.InvitationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Builder
public class GuideInvitationResponse {
    private Long id;
    private String email;
    private String message;
    private InvitationStatus status;
    private ZonedDateTime sentAt;
    private String name;
    private String company;
}
