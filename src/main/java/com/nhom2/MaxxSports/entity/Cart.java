package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "gio_hang")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_gio_hang")
    private Long maGioHang;

    @Column(name = "so_luong_tong_gh")
    private Integer soLuongTongGH;

    // Liên kết 1-1 với bảng User (Mỗi User có 1 giỏ hàng)
    @OneToOne
    @JoinColumn(name = "ma_khach_hang")
    private User user;
}