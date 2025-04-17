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
    @JoinColumn(name = "owner_id")
    private User owner; // Only if this user is a GUIDE

    @ManyToMany(mappedBy = "guides")
    private Set<Tour> assignedTours = new HashSet<>();

    @PrePersist
    @PreUpdate
    private void validateGuideOwnerAssignment() {
        if (role == Role.GUIDE && owner == null) {
            throw new IllegalStateException("A user with role GUIDE must have an assigned owner.");
        }
        if ((role == Role.OWNER || role == Role.TOURIST) && owner != null) {
            throw new IllegalStateException("Only GUIDEs can have an assigned owner.");
        }
    }
}

