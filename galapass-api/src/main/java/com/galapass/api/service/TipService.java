package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.entity.Tip;
import com.galapass.api.repository.TipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipService {

    private final TipRepository tipRepository;

    public List<Tip> getAllTips() {
        return tipRepository.findAll();
    }

    public Tip getTipById(Long id) {
        return tipRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Tip with ID " + id + " not found."));
    }

    public Tip createTip(Tip tip) {
        return tipRepository.save(tip);
    }

    public Tip updateTip(Tip tipUpdate) {
        return tipRepository.findById(tipUpdate.getId())
                .map(existingTip -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingTip, tipUpdate);
                        return tipRepository.save(existingTip);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update tip", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Tip with ID " + tipUpdate.getId() + " not found."));
    }

    public void deleteTipById(Long id) {
        tipRepository.deleteById(id);
    }
}
