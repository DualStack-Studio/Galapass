package com.galapass.api.tour.entity;

public enum Duration {
    HALF_DAY("Half Day"),
    FULL_DAY("Full Day"),
    MULTI_DAY("Multi Day");

    private final String displayName;

    Duration(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
