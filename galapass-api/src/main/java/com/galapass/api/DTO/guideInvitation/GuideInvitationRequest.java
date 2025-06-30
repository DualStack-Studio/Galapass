package com.galapass.api.DTO.guideInvitation;

import lombok.Data;

@Data
public class GuideInvitationRequest {
    private Long guideId;
    private Long companyId;
    private String message;
}
