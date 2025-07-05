package com.galapass.api.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle specific exception
    @ExceptionHandler(TourNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTourNotFound(TourNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Tour Not Found");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // Handle any other unhandled exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralError(Exception ex) {
        logger.error("Unexpected error occurred", ex);

        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal Server Error");
        error.put("message", "Something went wrong. Please try again later.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}