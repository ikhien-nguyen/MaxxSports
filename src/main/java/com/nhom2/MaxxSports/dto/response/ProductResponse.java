package com.nhom2.MaxxSports.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponse {

    private Long maSanPham;
    private String tenSanPham;
    private String moTa;
    private String thuongHieu;
    private String chatLieu;
    private String loaiSanPham;
    private Double gia;
    private Integer soLuong;
}