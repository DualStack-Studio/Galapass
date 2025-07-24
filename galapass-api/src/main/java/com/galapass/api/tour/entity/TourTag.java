package com.galapass.api.tour.entity;

/**
 * Represents descriptive tags that can be applied to tours.
 * Each tag includes a user-friendly display name.
 */
public enum TourTag {

    FAMILY_FRIENDLY("Family Friendly"),
    LUXURY("Luxury"),
    BUDGET("Budget"),
    FULL_DAY("Full Day"),
    HALF_DAY("Half Day"),
    MULTI_DAY("Multi-Day"),
    PRIVATE("Private"),
    GROUP("Group"),
    ACCESSIBLE("Accessible"),
    ECO_FRIENDLY("Eco-Friendly"),
    ISLAND_HOPPING("Island Hopping"),
    BEACH("Beach"),
    SUNSET("Sunset"),
    WILDLIFE_FOCUS("Wildlife Focus"),
    MARINE_FOCUS("Marine Focus"),
    LAND_FOCUS("Land Focus"),
    BEGINNER_FRIENDLY("Beginner Friendly"),
    ADVANCED("Advanced"),
    PHOTOGRAPHY_OPPORTUNITY("Photography Opportunity");

    private final String displayName;

    TourTag(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}