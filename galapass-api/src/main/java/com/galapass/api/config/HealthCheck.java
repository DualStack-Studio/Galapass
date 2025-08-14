package com.galapass.api.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/actuator")
public class HealthCheck {

    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"UP\"}";
    }
}
