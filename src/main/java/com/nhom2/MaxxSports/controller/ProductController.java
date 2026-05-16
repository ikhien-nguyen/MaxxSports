package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.ProductRequest;
import com.nhom2.MaxxSports.dto.response.ProductResponse;
import com.nhom2.MaxxSports.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/getAllProducts")
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                productService.searchProducts(keyword)
        );
    }
    @GetMapping("/category")
    public ResponseEntity<List<ProductResponse>> filterByCategory(
            @RequestParam String loaiSanPham
    ) {

        return ResponseEntity.ok(
                productService.filterByCategory(loaiSanPham)
        );
    }
    @GetMapping("/brand")
    public ResponseEntity<List<ProductResponse>> filterByBrand(
            @RequestParam String thuongHieu
    ) {

        return ResponseEntity.ok(
                productService.filterByBrand(thuongHieu)
        );
    }
    @GetMapping("/sort")
    public ResponseEntity<List<ProductResponse>> sortByPrice(
            @RequestParam String loaiSanPham,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        return ResponseEntity.ok(
                productService.sortByPrice(
                        loaiSanPham,
                        direction
                )
        );
    }
    @GetMapping("/getProduct/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ProductResponse> create(@RequestBody @Valid ProductRequest request) {
        return ResponseEntity.status(201).body(productService.createProduct(request));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @RequestBody @Valid ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}