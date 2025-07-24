package com.galapass.api.media.DTO;

import com.galapass.api.media.entity.MediaType;
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