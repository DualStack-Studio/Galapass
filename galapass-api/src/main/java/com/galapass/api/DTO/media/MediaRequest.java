package com.galapass.api.DTO.media;

import com.galapass.api.entity.media.MediaType;
import lombok.Data;

@Data
public class MediaRequest {
    private String url;
    private MediaType type;
    private int displayOrder;
}
