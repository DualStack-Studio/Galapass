package com.galapass.api.enums.service;

import com.galapass.api.enums.entity.Location;
import com.galapass.api.tour.entity.Destination;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnumService {

    public List<Destination> getAvailableDestinations(Location departureLocation) {
        if (departureLocation == null) {
            return List.of(); // Return empty list if no location is specified
        }
        return Destination.getDestinationsByLocation(departureLocation);
    }

}
