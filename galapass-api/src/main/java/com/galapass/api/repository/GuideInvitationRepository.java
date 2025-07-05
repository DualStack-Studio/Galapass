package com.galapass.api.repository;

import com.galapass.api.entity.InvitationStatus;
import com.galapass.api.entity.user.GuideInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuideInvitationRepository extends JpaRepository<GuideInvitation, Long> {
    List<GuideInvitation> findByCompanyId(Long companyId);
    List<GuideInvitation> findByGuideId(Long guideId);
    List<GuideInvitation> findByGuideIdAndStatus(Long guideId, InvitationStatus status);

}
