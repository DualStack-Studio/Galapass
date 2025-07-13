package com.galapass.api.entity.tour;

public enum TourCategory {
    WILDLIFE("Wildlife"),
    SNORKELING("Snorkeling"),
    HIKING("Hiking"),
    CRUISE("Cruise"),
    DIVING("Diving"),
    KAYAKING("Kayaking"),
    PHOTOGRAPHY("Photography"),
    CULTURAL("Cultural"),
    SCIENCE_EDUCATION("Science & Education"),
    ADVENTURE("Adventure");

    private final String displayName;

    TourCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
