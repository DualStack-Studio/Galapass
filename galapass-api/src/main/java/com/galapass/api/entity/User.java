package com.galapass.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String profilePhoto;
    private String bio;
    private String language;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private TourCompany company;

    @PrePersist
    @PreUpdate
    private void validateCompanyAssignment() {
        if (role == Role.GUIDE && company == null) {
            throw new IllegalStateException("A user with role GUIDE must belong to a company.");
        }
        if ((role == Role.OWNER || role == Role.TOURIST) && company != null) {
            throw new IllegalStateException("Only GUIDEs can be assigned to a company.");
        }
    }
}
