package com.nhom2.MaxxSports.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    private String tenSanPham;
    private String moTa;
    private String thuongHieu;
    private String chatLieu;
    private String loaiSanPham;
    private Double gia;
    private Integer soLuong;
}