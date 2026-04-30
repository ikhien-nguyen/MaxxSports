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

    // Lấy tất cả sản phẩm
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Lấy theo ID
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        return toResponse(product);
    }

    // Tạo mới
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .tenSanPham(request.getTenSanPham())
                .moTa(request.getMoTa())
                .thuongHieu(request.getThuongHieu())
                .chatLieu(request.getChatLieu())
                .loaiSanPham(request.getLoaiSanPham())
                .gia(request.getGia())
                .soLuong(request.getSoLuong())
                .build();

        return toResponse(productRepository.save(product));
    }

    // Update
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        product.setTenSanPham(request.getTenSanPham());
        product.setMoTa(request.getMoTa());   // ✅ sửa ở đây
        product.setThuongHieu(request.getThuongHieu());
        product.setChatLieu(request.getChatLieu());
        product.setLoaiSanPham(request.getLoaiSanPham());
        product.setGia(request.getGia());
        product.setSoLuong(request.getSoLuong());

        return toResponse(productRepository.save(product));
    }

    // Delete
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Convert
    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .maSanPham(product.getMaSanPham())
                .tenSanPham(product.getTenSanPham())
                .moTa(product.getMoTa())
                .thuongHieu(product.getThuongHieu())
                .chatLieu(product.getChatLieu())
                .loaiSanPham(product.getLoaiSanPham())
                .gia(product.getGia())
                .soLuong(product.getSoLuong())
                .build();
    }
}