package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.CategoryRequest;
import com.nhom2.MaxxSports.dto.response.CategoryResponse;
import com.nhom2.MaxxSports.entity.Category;
import com.nhom2.MaxxSports.entity.ProductType;
import com.nhom2.MaxxSports.repository.CategoryRepository;
import com.nhom2.MaxxSports.repository.ProductTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductTypeRepository productTypeRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return mapToResponse(category);
    }

    public CategoryResponse create(CategoryRequest request) {
        ProductType productType = productTypeRepository.findById(request.getProductTypeId())
                .orElseThrow(() -> new RuntimeException("Product type not found"));

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .productType(productType)
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        ProductType productType = productTypeRepository.findById(request.getProductTypeId())
                .orElseThrow(() -> new RuntimeException("Product type not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setProductType(productType);

        return mapToResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .productTypeId(category.getProductType() != null ? category.getProductType().getId() : null)
                .productTypeName(category.getProductType() != null ? category.getProductType().getName() : null)
                .build();
    }
}