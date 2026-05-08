package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.ProductRequest;
import com.nhom2.MaxxSports.dto.response.ProductResponse;
import com.nhom2.MaxxSports.entity.Product;
import com.nhom2.MaxxSports.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        return toResponse(product);
    }
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .tenSanPham(request.getTenSanPham())
                .moTa(request.getMoTa())
                .thuongHieu(request.getThuongHieu())
                .chatLieu(request.getChatLieu())
                .loaiSanPham(request.getLoaiSanPham())
                .gia(request.getGia())
                .build();

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        product.setTenSanPham(request.getTenSanPham());
        product.setMoTa(request.getMoTa());   // ✅ sửa ở đây
        product.setThuongHieu(request.getThuongHieu());
        product.setChatLieu(request.getChatLieu());
        product.setLoaiSanPham(request.getLoaiSanPham());
        product.setGia(request.getGia());

        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .maSanPham(product.getMaSanPham())
                .tenSanPham(product.getTenSanPham())
                .moTa(product.getMoTa())
                .thuongHieu(product.getThuongHieu())
                .chatLieu(product.getChatLieu())
                .loaiSanPham(product.getLoaiSanPham())
                .gia(product.getGia())
                .build();
    }
}