package com.galapass.api.tip.controller;

import com.galapass.api.tip.entity.Tip;
import com.galapass.api.tip.service.TipService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tips")
@RequiredArgsConstructor
@Tag(name = "Tip API", description = "Tip API")
public class TipController {

    private final TipService tipService;

    @GetMapping
    public ResponseEntity<List<Tip>> getAllTips() {
        return ResponseEntity.ok(tipService.getAllTips());
    }

    @PostMapping
    public ResponseEntity<Tip> createTip(@RequestBody Tip tip) {
        return ResponseEntity.ok(tipService.createTip(tip));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tip> getTipById(@PathVariable Long id) {
        return ResponseEntity.ok(tipService.getTipById(id));
    }

    @PutMapping
    public ResponseEntity<Tip> updateTip(@RequestBody Tip tip) {
        return ResponseEntity.ok(tipService.updateTip(tip));
    }

    @DeleteMapping("/{id}")
    public void deleteTipById(@PathVariable Long id) {
        tipService.deleteTipById(id);
    }
}
