package com.galapass.api.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.galapass.api.entity.TourCompany;
import com.galapass.api.repository.TourCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourCompanyService {

    private final TourCompanyRepository tourCompanyRepository;

    public List<TourCompany> getAllTourCompanies() {
        return tourCompanyRepository.findAll();
    }

    public TourCompany getTourCompanyById(Long id) {
        return tourCompanyRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Tour Company with ID " + id + " not found."));
    }

    public TourCompany createTourCompany(TourCompany tourCompany) {
        return tourCompanyRepository.save(tourCompany);
    }

    public TourCompany updateTourCompany(TourCompany tourCompanyUpdate) {
        return tourCompanyRepository.findById(tourCompanyUpdate.getId())
                .map(existingCompany -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        mapper.updateValue(existingCompany, tourCompanyUpdate);
                        return tourCompanyRepository.save(existingCompany);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to update tour company", e);
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("Tour Company with ID " + tourCompanyUpdate.getId() + " not found."));
    }

    public void deleteTourCompanyById(Long id) {
        tourCompanyRepository.deleteById(id);
    }
}
