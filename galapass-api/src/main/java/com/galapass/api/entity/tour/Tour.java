package com.galapass.api.entity.tour;
import com.galapass.api.entity.CompanyTourStatus;
import com.galapass.api.entity.Location;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.entity.TourReview;
import com.galapass.api.entity.media.Media;
import com.galapass.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
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

    @Enumerated(EnumType.STRING)
    private Location location;

    @Enumerated(EnumType.STRING)
    private Destination destination;

    @ElementCollection(targetClass = Bring.class)
    @CollectionTable(name = "tour_brings", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "bring", nullable = false)
    @Enumerated(EnumType.STRING)
    private List<Bring> brings = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<Media> media = new ArrayList<>();

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


    @ElementCollection(targetClass = TourTag.class)
    @CollectionTable(name = "tour_tags", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "tag")
    @Enumerated(EnumType.STRING)
    private Set<TourTag> tags = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private Duration duration;

    @Column
    private Integer maxGuests;

    @ElementCollection
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    private List<String> highlights = new ArrayList<>();
}