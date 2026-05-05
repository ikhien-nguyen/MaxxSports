package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chi_tiet_san_pham")
public class ProductDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_ctsp")
    private Long maCtsp;

    // Nối với bảng Product
    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    // Nối với bảng Size
    @ManyToOne
    @JoinColumn(name = "ma_size")
    private Size size;

    // Nối với bảng Màu
    @ManyToOne
    @JoinColumn(name = "ma_mau")
    private Mau mau;

    // Số lượng tồn kho của riêng biến thể này
    @Column(name = "so_luong_ton")
    private Integer soLuongTon;
}