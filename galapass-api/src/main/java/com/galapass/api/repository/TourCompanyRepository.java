package com.galapass.api.repository;

import com.galapass.api.entity.TourCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TourCompanyRepository extends JpaRepository<TourCompany, Long> {
    Optional<TourCompany> findByName(String name);

    List<TourCompany> findAllByOwner_Id(Long ownerId);
}
