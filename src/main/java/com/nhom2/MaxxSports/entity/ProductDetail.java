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

    @Column(name = "so_luong")
    private Integer soLuong;
    // Nối với bảng Product
    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    // Nối với bảng Size
    @ManyToOne
    @JoinColumn(name = "ma_size")
    private Size size;

    // Nối với bản g Màu
    @ManyToOne
    @JoinColumn(name = "ma_mau")
    private Mau mau;

}