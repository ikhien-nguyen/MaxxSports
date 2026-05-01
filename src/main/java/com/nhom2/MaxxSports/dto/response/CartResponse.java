package com.nhom2.MaxxSports.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long maGioHang;
    private Integer soLuongTongGH;
    private Double tongTien;
    private List<CartItemResponse> items;
}