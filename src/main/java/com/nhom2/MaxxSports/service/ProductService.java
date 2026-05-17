package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.ProductRequest;
import com.nhom2.MaxxSports.dto.response.ProductResponse;
import com.nhom2.MaxxSports.entity.Product;
import com.nhom2.MaxxSports.mapper.ProductMapper;
import com.nhom2.MaxxSports.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {

    ProductRepository productRepository;
    ProductMapper productMapper;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        return productMapper.toProductResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = productMapper.toProduct(request);

        product = productRepository.save(product);

        return productMapper.toProductResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        product.setTenSanPham(request.getTenSanPham());
        product.setMoTa(request.getMoTa());
        product.setThuongHieu(request.getThuongHieu());
        product.setChatLieu(request.getChatLieu());
        product.setLoaiSanPham(request.getLoaiSanPham());
        product.setGia(request.getGia());

        product = productRepository.save(product);

        return productMapper.toProductResponse(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sản phẩm"));
        productRepository.delete(product);
    }
}