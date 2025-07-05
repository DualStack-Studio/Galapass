package com.galapass.api.DTO.guideInvitation;

import com.galapass.api.entity.InvitationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GuideInvitationResponse {
    private Long id;
    private String email;
    private String message;
    private InvitationStatus status;
    private LocalDateTime sentAt;

    private CompanyInfo company;

    @Data
    @Builder
    public static class CompanyInfo {
        private Long id;
        private String name;
        private String email;
        private String logo;
    }
}
