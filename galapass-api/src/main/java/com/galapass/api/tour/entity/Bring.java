package com.galapass.api.tour.entity;

/**
 * Represents recommended items for visitors to bring on a Galapagos tour.
 * Each item includes a user-friendly display name.
 */
public enum Bring {

    SUN_PROTECTION("Sunscreen & Hat"),
    LIGHT_JACKET("Light Jacket / Raincoat"),
    CAMERA("Camera / Smartphone"),
    REUSABLE_WATER_BOTTLE("Reusable Water Bottle"),
    COMFORTABLE_SHOES("Comfortable Walking Shoes"),
    SWIMSUIT("Swimsuit"),
    BACKPACK("Small Backpack / Daypack"),
    SUNGLASSES("Sunglasses"),
    SEASICKNESS_MEDICATION("Seasickness Medication"),
    CASH("Cash (for tips & small purchases)"),
    WATER_SHOES("Water Shoes / Sandals"),
    BINOCULARS("Binoculars");

    private final String displayName;

    Bring(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}