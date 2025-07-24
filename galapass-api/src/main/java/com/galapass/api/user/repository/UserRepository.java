package com.galapass.api.user.repository;

import com.galapass.api.user.entity.Role;
import com.galapass.api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> getGuideByName(@Param("role") Role role, @Param("name") String name);

    long countByRole(Role role);
}
