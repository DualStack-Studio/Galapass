package com.galapass.api.tour.controller;

import com.galapass.api.media.DTO.MediaResponse;
import com.galapass.api.media.entity.MediaType;
import com.galapass.api.media.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/tours/{tourId}/media")
@RequiredArgsConstructor
public class TourFileUploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Handles uploading a single media file (image or video) for a specific tour.
     * It intelligently determines the file type, applies relevant transformations (like trimming for videos),
     * and returns a structured response with the URL and media type.
     *
     * @param tourId The ID of the tour to associate the media with.
     * @param file The media file to upload.
     * @return A ResponseEntity containing a MediaUploadResponse DTO or an error message.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<?> uploadMedia(
            @PathVariable Long tourId,
            @RequestParam("file") MultipartFile file) {

        String contentType = file.getContentType();
        if (contentType == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Could not determine file type."));
        }

        try {
            String url;
            MediaType type;

            if (contentType.startsWith("image/")) {
                url = cloudinaryService.uploadFile(file);
                type = MediaType.IMAGE;
            } else if (contentType.startsWith("video/")) {
                url = cloudinaryService.uploadAndTrimVideo(file, 15);
                type = MediaType.VIDEO;
            } else {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid file type. Please upload an image or video."));
            }

            // After uploading, you would save this media object to your database, associated with the tourId
            // For example: mediaService.createMedia(tourId, url, type);

            // Return a structured response for the frontend
            MediaResponse response = new MediaResponse(url, type);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "File upload failed due to a server error."));
        }
    }

    /**
     * Handles the deletion of a media file from Cloudinary based on its public URL.
     *
     * @param tourId The ID of the tour this media belongs to (for authorization).
     * @param payload A Map containing the "url" of the file to be deleted.
     * @return A ResponseEntity with a success or error message.
     */
    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<Map<String, String>> deleteMedia(
            @PathVariable Long tourId,
            @RequestBody Map<String, String> payload) {

        String url = payload.get("url");

        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "File URL must be provided."));
        }

        try {
            // Here you would also remove the media record from your own database
            // For example: mediaService.deleteMediaByUrl(url);

            cloudinaryService.deleteFileFromUrl(url);
            return ResponseEntity.ok(Map.of("message", "Media deleted successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred during file deletion."));
        }
    }
}