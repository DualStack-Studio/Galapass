package com.galapass.api.tour.entity;

import com.galapass.api.enums.entity.Location;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Destination {

    // ===== Destinations from SANTA CRUZ =====
    ISLA_BARTOLOME("Isla Bartolomé", Location.SANTA_CRUZ),
    SEYMOUR_NORTE("Isla Seymour Norte", Location.SANTA_CRUZ),
    ISLA_SANTA_FE("Isla Santa Fe", Location.SANTA_CRUZ),
    ISLAS_PLAZAS("Islas Plazas", Location.SANTA_CRUZ),
    ISLA_PINZON("Isla Pinzón", Location.SANTA_CRUZ),
    ISLA_FLOREANA("Isla Floreana", Location.SANTA_CRUZ),
    TOUR_DE_BAHIA_SC("Tour de Bahía Santa Cruz", Location.SANTA_CRUZ),
    CERRO_DRAGON("Cerro Dragón", Location.SANTA_CRUZ),

    // ===== Destinations from SAN CRISTOBAL =====
    LEON_DORMIDO("León Dormido / Kicker Rock", Location.SAN_CRISTOBAL),
    ISLA_LOBOS("Isla Lobos", Location.SAN_CRISTOBAL),
    ISLA_ESPANOLA("Isla Española", Location.SAN_CRISTOBAL),
    PUNTA_PITT("Punta Pitt", Location.SAN_CRISTOBAL),
    TOUR_360_SAN_CRISTOBAL("Tour 360° San Cristóbal", Location.SAN_CRISTOBAL),

    // ===== Destinations from ISABELA =====
    LOS_TUNELES("Los Túneles / Cabo Rosa", Location.ISABELA),
    LAS_TINTORERAS("Las Tintoreras", Location.ISABELA),
    VOLCAN_SIERRA_NEGRA("Volcán Sierra Negra", Location.ISABELA);


    private final String displayName;
    private final Location departureLocation;

    Destination(String displayName, Location departureLocation) {
        this.displayName = displayName;
        this.departureLocation = departureLocation;
    }

    /**
     * Gets the user-friendly name of the destination (e.g., "Isla Bartolomé").
     * @return The display name String.
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Gets the departure location for this destination's tour.
     * @return The Location enum constant (e.g., Location.SANTA_CRUZ).
     */
    public Location getDepartureLocation() {
        return departureLocation;
    }

    /**
     * The core filtering logic.
     * Gets all destinations available from a specific departure location.
     *
     * @param location The island the tour departs from (e.g., Location.SANTA_CRUZ).
     * @return A List of matching Destination enums.
     */
    public static List<Destination> getDestinationsByLocation(Location location) {
        return Arrays.stream(Destination.values())
                .filter(destination -> destination.getDepartureLocation() == location)
                .collect(Collectors.toList());
    }
}