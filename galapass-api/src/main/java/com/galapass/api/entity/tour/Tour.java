package com.galapass.api.entity.tour;
import com.galapass.api.entity.CompanyTourStatus;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.TourReview;
import com.galapass.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double price;

    @Enumerated(EnumType.STRING)
    private TourCategory category;

    private String location;

    @ElementCollection
    @CollectionTable(name = "tour_photos", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "photo_url")
    private List<String> photoUrls = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private CompanyTourStatus status;


    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToMany
    @JoinTable(
            name = "tour_guide",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "guide_id")
    )
    private Set<User> guides = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "company_id")
    private TourCompany company;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL)
    private List<TourReview> reviews = new ArrayList<>();

    @ElementCollection(targetClass = TourTag.class)
    @CollectionTable(name = "tour_tags", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "tag")
    @Enumerated(EnumType.STRING)
    private Set<TourTag> tags = new HashSet<>();

    @Column
    private String duration;

    @Column
    private Integer maxGuests;

    @ElementCollection
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    private List<String> highlights = new ArrayList<>();
}