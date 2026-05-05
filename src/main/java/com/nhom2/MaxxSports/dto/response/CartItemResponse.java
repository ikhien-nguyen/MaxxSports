package com.nhom2.MaxxSports.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long maCtsp;
    private String tenSanPham;
    private String size;
    private String mau;
    private Double gia;
    private Integer soLuong;
    private Double thanhTien;
    private String urlAnh;
}