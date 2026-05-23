package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.ProductTypeRequest;
import com.nhom2.MaxxSports.dto.response.ProductTypeResponse;
import com.nhom2.MaxxSports.entity.ProductType;
import com.nhom2.MaxxSports.repository.ProductTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductTypeService {

    private final ProductTypeRepository productTypeRepository;

    public List<ProductTypeResponse> getAll() {
        return productTypeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductTypeResponse getById(Long id) {
        ProductType productType = productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product type not found"));
        return mapToResponse(productType);
    }

    public ProductTypeResponse create(ProductTypeRequest request) {
        ProductType productType = ProductType.builder()
                .name(request.getName())
                .build();
        return mapToResponse(productTypeRepository.save(productType));
    }

    public ProductTypeResponse update(Long id, ProductTypeRequest request) {
        ProductType productType = productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product type not found"));

        productType.setName(request.getName());
        return mapToResponse(productTypeRepository.save(productType));
    }

    public void delete(Long id) {
        ProductType productType = productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product type not found"));
        productTypeRepository.delete(productType);
    }

    private ProductTypeResponse mapToResponse(ProductType productType) {
        return ProductTypeResponse.builder()
                .id(productType.getId())
                .name(productType.getName())
                .build();
    }
}