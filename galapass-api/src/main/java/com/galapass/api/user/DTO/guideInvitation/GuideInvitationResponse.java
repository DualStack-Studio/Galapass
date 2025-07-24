package com.galapass.api.DTO.guideInvitation;

import com.galapass.api.entity.user.InvitationStatus;
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
