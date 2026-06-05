package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "DANH_GIA_SAN_PHAM")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDanhGia")
    private Long maDanhGia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaKhachHang", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MaCTSP", nullable = false)
    private ProductDetail productDetail;

    @Column(name = "SoSao", nullable = false)
    private int soSao;

    @Column(name = "TieuDe", length = 255)
    private String tieuDe;

    @Column(name = "NoiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "NgayDang")
    private LocalDateTime ngayDang;

    @PrePersist
    protected void onCreate() {
        this.ngayDang = LocalDateTime.now();
    }
}