package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.ProductDetailRequest;
import com.nhom2.MaxxSports.dto.response.ApiResponse;
import com.nhom2.MaxxSports.dto.response.ProductDetailResponse;
import com.nhom2.MaxxSports.service.ProductDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductDetailController {

    ProductDetailService productDetailService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ApiResponse<ProductDetailResponse> create(@RequestBody ProductDetailRequest request) {
        return ApiResponse.<ProductDetailResponse>builder()
                .result(productDetailService.create(request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ProductDetailResponse> update(@PathVariable Long id, @RequestBody ProductDetailRequest request) {
        return ApiResponse.<ProductDetailResponse>builder()
                .result(productDetailService.update(id, request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> getById(@PathVariable Long id) {
        return ApiResponse.<ProductDetailResponse>builder()
                .result(productDetailService.getById(id))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        productDetailService.delete(id);
        return ApiResponse.<String>builder()
                .result("Xóa chi tiết sản phẩm thành công")
                .build();
    }
}