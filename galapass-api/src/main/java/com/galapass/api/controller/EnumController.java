package com.galapass.api.controller;

import com.galapass.api.DTO.enums.*;
import com.galapass.api.entity.Location;
import com.galapass.api.entity.tour.*;
import com.galapass.api.service.EnumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enums")
@RequiredArgsConstructor
public class EnumController {

    private final EnumService enumService;


    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        List<CategoryDTO> categories = Arrays.stream(TourCategory.values())
                .map(category -> new CategoryDTO(category.name(), category.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/durations")
    public ResponseEntity<List<DestinationDTO>> getDurations() {
        List<DestinationDTO> durations = Arrays.stream(Duration.values())
                .map(duration -> new DestinationDTO(duration.name(), duration.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(durations);
    }

    @GetMapping("/tags")
    public ResponseEntity<List<TourTagDTO>> getTags() {
        List<TourTagDTO> tags = Arrays.stream(TourTag.values())
                .map(tag -> new TourTagDTO(tag.name(), tag.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/locations")
    public ResponseEntity<List<LocationDTO>> getLocations() {
        List<LocationDTO> locations = Arrays.stream(Location.values())
                .map(location -> new LocationDTO(location.name(), location.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/brings")
    public ResponseEntity<List<BringDTO>> getBrings() {
        List<BringDTO> brings = Arrays.stream(Bring.values())
                .map(bring -> new BringDTO(bring.name(), bring.getDisplayName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(brings);
    }

    @GetMapping("/destinations/{location}")
    public ResponseEntity<List<DestinationDTO>> getAvailableDestinationsByLocation(
            @PathVariable("location") String locationString) {

        Location departureLocation;
        try {
            // Convert the input string to the Location enum, case-insensitively.
            departureLocation = Location.valueOf(locationString.toUpperCase());
        } catch (IllegalArgumentException e) {
            // If the string doesn't match any enum, it's a bad request.
            return ResponseEntity.badRequest().build();
        }

        // Use the service to get the list of Destination enums
        List<Destination> destinations = enumService.getAvailableDestinations(departureLocation);

        // Convert the list of enums to a list of DTOs for a clean JSON response
        List<DestinationDTO> destinationDtos = destinations.stream()
                .map(dest -> new DestinationDTO(dest.name(), dest.getDisplayName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(destinationDtos);
    }
}
