package com.galapass.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.galapass.api.entity.tour.Tour;
import com.galapass.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TourCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    @Column(unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyTourStatus status = CompanyTourStatus.ACTIVE;

    private String location;

    @Column(length = 20)
    private String phone;
    private String email;
    private String description;
    private String logo;

    @ManyToMany(mappedBy = "companies", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private Set<User> guides = new HashSet<>();

    @OneToMany(mappedBy = "company")
    private Set<Tour> tours = new HashSet<>();
}
