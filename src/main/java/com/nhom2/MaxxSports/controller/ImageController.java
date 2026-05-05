package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.response.ApiResponse;
import com.nhom2.MaxxSports.entity.Images;
import com.nhom2.MaxxSports.service.ImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImageController {
    ImageService imageService;

    @PostMapping("/upload")
    public ApiResponse<Images> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<Images>builder()
                .result(imageService.upload(file))
                .build();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        imageService.delete(id);
        return "Deleted successfully";
    }
}
