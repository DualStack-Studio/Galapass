package com.galapass.api.repository;

import com.galapass.api.entity.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipRepository extends JpaRepository<Tip, Long> {}
