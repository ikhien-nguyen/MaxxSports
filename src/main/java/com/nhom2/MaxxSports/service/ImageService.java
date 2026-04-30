package com.nhom2.MaxxSports.service;

import com.cloudinary.Cloudinary;
import com.nhom2.MaxxSports.entity.Images;
import com.nhom2.MaxxSports.repository.ImageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImageService {
    Cloudinary cloudinary;
    ImageRepository imageRepository;

    public Images upload(MultipartFile file) {
        try {
            Map<?, ?> result = cloudinary.uploader()
                    .upload(file.getBytes(), Map.of());

            String url = result.get("secure_url").toString();
            String publicId = result.get("public_id").toString();

            Images image= Images.builder()
                    .url(url)
                    .publicId(publicId)
                    .build();

            return imageRepository.save(image);

        } catch (IOException e) {
            throw new RuntimeException("Tải ảnh không thành công", e);
        }
    }

    public void delete(String id) {
        Images image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));

        try {
            cloudinary.uploader().destroy(image.getPublicId(), Map.of());
        } catch (IOException e) {
            throw new RuntimeException("Xóa ảnh không thành công", e);
        }

        imageRepository.delete(image);
    }
    public Images getById(String id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));
    }
//    public List<Images> getAll() {
//        return imageRepository.findAll().stream().toList();
//    }
}
