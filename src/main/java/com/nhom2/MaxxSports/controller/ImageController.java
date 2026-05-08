package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.entity.Images;
import com.nhom2.MaxxSports.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/upload/{maCtsp}")
    public ResponseEntity<Images> uploadImage(
            @PathVariable Long maCtsp,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                imageService.upload(file, maCtsp)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImage(@PathVariable String id) {
        imageService.delete(id);
        return ResponseEntity.ok("Xóa ảnh thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Images> getImage(@PathVariable String id) {
        return ResponseEntity.ok(
                imageService.getById(id)
        );
    }

    // Lấy toàn bộ ảnh của product detail
    @GetMapping("/product-detail/{maCtsp}")
    public ResponseEntity<List<Images>> getImagesByProductDetail(
            @PathVariable Long maCtsp) {
        return ResponseEntity.ok(
                imageService.getByProductDetail(maCtsp)
        );
    }
}