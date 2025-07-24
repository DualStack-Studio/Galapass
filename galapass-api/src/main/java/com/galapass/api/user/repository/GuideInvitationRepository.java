package com.galapass.api.user.repository;

import com.galapass.api.user.entity.GuideInvitation;
import com.galapass.api.user.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuideInvitationRepository extends JpaRepository<GuideInvitation, Long> {
    List<GuideInvitation> findByCompanyId(Long companyId);

    List<GuideInvitation> findByCompany_Owner_Id(Long ownerId);

    List<GuideInvitation> findByGuideId(Long guideId);
  
    List<GuideInvitation> findByGuideIdAndStatus(Long guideId, InvitationStatus status);
}
