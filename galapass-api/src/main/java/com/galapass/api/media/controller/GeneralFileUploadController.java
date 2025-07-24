package com.galapass.api.controller;

import com.galapass.api.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class GeneralFileUploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Handles the upload of a single image file for general purposes like profile pictures or logos.
     * It validates that the file is an image and returns a JSON response with the public URL.
     *
     * @param file The image file to upload, sent as multipart/form-data.
     * @return A ResponseEntity containing a Map with the "url" of the uploaded image, or an error message.
     */
    @PostMapping("/upload/image")
    // Note: Adjust the authorization as needed for your application's security requirements.
    // isAuthenticated() is a good default for users uploading their own profile pictures.
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        String contentType = file.getContentType();

        // Validate that the uploaded file is an image
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("error", "Invalid file type. Please upload an image."));
        }

        try {
            // Use the existing service to upload the file
            String imageUrl = cloudinaryService.uploadFile(file);

            // Return a simple JSON response: { "url": "http://..." }
            return ResponseEntity.ok(Map.of("url", imageUrl));

        } catch (IOException e) {
            // It's good practice to log the exception
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "Image upload failed due to a server error."));
        } catch (Exception e) {
            // Catch any other unexpected exceptions from the service
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "An unexpected error occurred during upload."));
        }
    }

    /**
     * Handles the deletion of a file from Cloudinary based on its public URL.
     * It expects a JSON payload with the "url" of the file to be deleted.
     *
     * @param payload A Map containing the "url" of the file.
     * @return A ResponseEntity with a success message or an error message.
     */
    @DeleteMapping("/delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteImage(
            @RequestBody Map<String, String> payload) {

        String url = payload.get("url");

        // Validate that the URL has been provided
        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("error", "File URL must be provided."));
        }

        try {
            // The service layer handles extracting the public ID and deleting the file
            cloudinaryService.deleteFileFromUrl(url);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully."));
        } catch (IllegalArgumentException e) {
            // This can be thrown by the service if the URL is invalid or malformed
            return ResponseEntity
                    .status(400)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Catch any other unexpected exceptions from the service
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "An unexpected error occurred during file deletion."));
        }
    }
}