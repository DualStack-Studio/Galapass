package com.galapass.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads a file (image or video) to Cloudinary without modifications.
     * This method is suitable for all files within the Cloudinary free tier limits.
     *
     * @param file The MultipartFile to upload.
     * @return The secure URL of the uploaded file.
     * @throws IOException if an I/O error occurs.
     */
    public String uploadFile(MultipartFile file) throws IOException {
        String resourceType = "auto";
        String contentType = file.getContentType();
        if (contentType != null) {
            if (contentType.startsWith("image/")) {
                resourceType = "image";
            } else if (contentType.startsWith("video/")) {
                resourceType = "video";
            }
        }
        Map<String, String> options = ObjectUtils.asMap("resource_type", resourceType);
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        return uploadResult.get("secure_url").toString();
    }

    /**
     * Uploads a video file and trims it to a specific duration.
     * The original video is uploaded, but the returned URL points to the trimmed version.
     *
     * @param file The video file to upload and trim.
     * @param durationInSeconds The desired duration of the final video in seconds.
     * @return The secure URL of the trimmed video.
     * @throws IOException if an I/O error occurs.
     */
    public String uploadAndTrimVideo(MultipartFile file, int durationInSeconds) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "resource_type", "video",
                "eager", List.of(
                        new com.cloudinary.Transformation()
                                .startOffset("0")
                                .duration(durationInSeconds)
                )
        );

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

        // Extract the URL of the eagerly transformed (trimmed) version
        List<Map<String, String>> eager = (List<Map<String, String>>) uploadResult.get("eager");
        if (eager != null && !eager.isEmpty()) {
            return eager.get(0).get("secure_url");
        }

        // fallback to original if eager failed
        return uploadResult.get("secure_url").toString();
    }



    public void deleteFileFromUrl(String url) throws IOException {
        String publicId = extractPublicIdFromUrl(url);

        // Determine resource type based on the URL path
        String resourceType;
        if (url.contains("/video/")) {
            resourceType = "video";
        } else {
            resourceType = "image";
        }

        cloudinary.uploader().destroy(publicId, Map.of("resource_type", resourceType));
    }


    private String extractPublicIdFromUrl(String url) {
        /*
         * This pattern uses a regular expression to find the public ID.
         * It looks for the string that comes after "/upload/" and an optional version
         * string (like "/v12345/"), but before the file extension.
         * This is much more reliable than splitting strings.
         *
         * Example: .../upload/v12345/folder/sample.jpg -> extracts "folder/sample"
         * Example: .../upload/u9buahy8euee4nlz90di.png -> extracts "u9buahy8euee4nlz90di"
         */
        final Pattern pattern = Pattern.compile("/upload/(?:v\\d+/)?(.+?)(?:\\.[\\w]+)?$");
        Matcher matcher = pattern.matcher(url);

        if (matcher.find()) {
            // The public ID is in the first capturing group.
            return matcher.group(1);
        }

        // If the pattern does not match, the URL is invalid.
        throw new IllegalArgumentException("Could not extract public ID from URL.");
    }
}
