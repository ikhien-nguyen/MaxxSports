package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.ProductTypeRequest;
import com.nhom2.MaxxSports.dto.response.ProductTypeResponse;
import com.nhom2.MaxxSports.service.ProductTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product-types")
@RequiredArgsConstructor
public class ProductTypeController {

    private final ProductTypeService productTypeService;

    @GetMapping
    public ResponseEntity<List<ProductTypeResponse>> getAll() {
        return ResponseEntity.ok(productTypeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductTypeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productTypeService.getById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductTypeResponse> create(@RequestBody ProductTypeRequest request) {
        return new ResponseEntity<>(productTypeService.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductTypeResponse> update(@PathVariable Long id, @RequestBody ProductTypeRequest request) {
        return ResponseEntity.ok(productTypeService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        productTypeService.delete(id);
        return ResponseEntity.ok("Xóa loại sản phẩm thành công!");
    }
}