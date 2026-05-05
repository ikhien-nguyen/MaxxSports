package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "anh")
public class Anh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_anh")
    private Long maAnh;

    // Link URL của ảnh hoặc tên file ảnh
    @Column(name = "anh")
    private String anh;

    // Nối về bảng Chi tiết sản phẩm (1 Chi tiết SP có thể có nhiều Ảnh)
    @ManyToOne
    @JoinColumn(name = "ma_ctsp")
    private ProductDetail productDetail;
}