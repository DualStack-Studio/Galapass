package com.galapass.api.entity;

public enum Location {
    SANTA_CRUZ("Santa Cruz, Galápagos"),
    SAN_CRISTOBAL("San Cristóbal, Galápagos"),
    FLOREANA("Floreana, Galápagos"),
    ISABELA("Isabela, Galápagos");

    private final String displayName;

    Location(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

}
