package com.galapass.api.media.DTO;
import com.galapass.api.media.entity.MediaType;
import lombok.Data;

@Data
public class MediaRequest {
    private String url;
    private MediaType type;
    private int displayOrder;
}
