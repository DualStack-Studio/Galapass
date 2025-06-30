package com.galapass.api.controller;

import com.galapass.api.entity.Location;
import com.galapass.api.entity.tour.TourCategory;
import com.galapass.api.entity.tour.TourTag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/categories")
    public TourCategory[] getCategories() {
        return TourCategory.values();
    }

    @GetMapping("/tags")
    public TourTag[] getTags() {
        return TourTag.values();
    }

    @GetMapping("/locations")
    public Location[] getLocations() {
        return Location.values();
    }
}
