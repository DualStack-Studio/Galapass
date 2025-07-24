package com.galapass.api.tip.repository;

import com.galapass.api.tip.entity.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipRepository extends JpaRepository<Tip, Long> {}
