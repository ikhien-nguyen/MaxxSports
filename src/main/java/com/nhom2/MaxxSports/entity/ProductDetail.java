package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "ma_size")
    private Size size;

    @ManyToOne
    @JoinColumn(name = "ma_mau")
    private Mau mau;

    @Builder.Default
    @OneToMany(
            mappedBy = "productDetail",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    private List<Images> images = new ArrayList<>();
}