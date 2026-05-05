package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.entity.Anh;
import com.nhom2.MaxxSports.entity.ProductDetail;
import com.nhom2.MaxxSports.repository.AnhRepository;
import com.nhom2.MaxxSports.repository.ProductDetailRepository;
import com.nhom2.MaxxSports.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/images") // Vì đã có context-path: /xsports trong yaml nên chỉ cần /images
@RequiredArgsConstructor
public class AnhController {

    private final FileStorageService fileStorageService;
    private final AnhRepository anhRepository;
    private final ProductDetailRepository productDetailRepository;

    @PostMapping("/upload/{maCtsp}")
    public ResponseEntity<String> uploadImage(
            @PathVariable Long maCtsp, 
            @RequestParam("file") MultipartFile file) {
        
        // 1. Lưu file vật lý vào thư mục uploads
        String fileName = fileStorageService.storeFile(file);
        
        // 2. Tìm ProductDetail trong DB
        ProductDetail pd = productDetailRepository.findById(maCtsp)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // 3. Lưu thông tin vào bảng 'anh'
        // Lưu ý: builder() yêu cầu @Builder trong Entity Anh
        Anh anh = Anh.builder()
                .anh("/uploads/" + fileName) // Đường dẫn tương đối để FE dễ dùng
                .productDetail(pd)
                .build();
        
        anhRepository.save(anh);

        return ResponseEntity.ok("Upload ảnh thành công: " + fileName);
    }
}