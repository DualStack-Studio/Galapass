package com.galapass.api.DTO.media;

import com.galapass.api.entity.media.MediaType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaResponse {
    private String url;
    private MediaType type;
}