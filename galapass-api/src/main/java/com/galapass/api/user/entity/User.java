package com.galapass.api.entity.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.galapass.api.entity.GuideReview;
import com.galapass.api.entity.TourCompany;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String profilePhoto = "/Static/uploads/blank-profile-picture.jpg";
    private String bio;
    private String language = "es";

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "guide_company",
            joinColumns = @JoinColumn(name = "guide_id"),
            inverseJoinColumns = @JoinColumn(name = "company_id")
    )
    private Set<TourCompany> companies = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private GuideStatus status = GuideStatus.OPERABLE;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @OneToMany(mappedBy = "guide", cascade = CascadeType.ALL)
    private List<GuideReview> reviews = new ArrayList<>();
}

