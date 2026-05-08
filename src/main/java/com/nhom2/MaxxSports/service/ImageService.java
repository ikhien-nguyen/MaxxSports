package com.nhom2.MaxxSports.service;

import com.cloudinary.Cloudinary;
import com.nhom2.MaxxSports.entity.Images;
import com.nhom2.MaxxSports.entity.ProductDetail;
import com.nhom2.MaxxSports.repository.ImageRepository;
import com.nhom2.MaxxSports.repository.ProductDetailRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImageService {

    Cloudinary cloudinary;
    ImageRepository imageRepository;
    ProductDetailRepository productDetailRepository;

    public Images upload(MultipartFile file, Long maCtsp) {
        try {
            ProductDetail productDetail = productDetailRepository.findById(maCtsp)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            Map<?, ?> result = cloudinary.uploader()
                    .upload(file.getBytes(), Map.of());

            String url = result.get("secure_url").toString();
            String publicId = result.get("public_id").toString();

            Images image = Images.builder()
                    .url(url)
                    .publicId(publicId)
                    .productDetail(productDetail)
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
            imageRepository.delete(image);

        } catch (IOException e) {
            throw new RuntimeException("Xóa ảnh không thành công", e);
        }
    }

    public Images getById(String id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));
    }

    public List<Images> getByProductDetail(Long maCtsp) {
        return imageRepository.findByProductDetail_MaCtsp(maCtsp);
    }
}