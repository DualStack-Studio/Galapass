package com.galapass.api.config;

import org.apache.tomcat.util.descriptor.web.SecurityRoleRef;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/actuator")
public class HealthCheck {

    @GetMapping("/health")
    @PreAuthorize("hasAuthority('OWNER')")
    public String health() {
        return "{\"status\":\"UP\"}";
    }
}
