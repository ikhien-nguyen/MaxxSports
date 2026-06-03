package com.nhom2.MaxxSports.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {

    Long maSanPham;

    String tenSanPham;

    String moTa;

    String thuongHieu;

    String chatLieu;

    String loaiSanPham;

    Double gia;

    String thumbnail;

    List<ProductDetailResponse> productDetails;
}