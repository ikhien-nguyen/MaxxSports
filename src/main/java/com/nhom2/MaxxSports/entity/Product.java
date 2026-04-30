package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_san_pham")
    private Long maSanPham;

    @Column(name = "ten_san_pham", nullable = false)
    private String tenSanPham;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "thuong_hieu")
    private String thuongHieu;

    @Column(name = "chat_lieu")
    private String chatLieu;

    @Column(name = "loai_san_pham")
    private String loaiSanPham;

    @Column(name = "gia")
    private Double gia;

    @Column(name = "so_luong")
    private Integer soLuong;
}