package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chi_tiet_gio_hang")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nối về Giỏ hàng chứa nó
    @ManyToOne
    @JoinColumn(name = "ma_gio_hang")
    private Cart cart;

    // Nối về Chi tiết sản phẩm (Món khách chọn)
    @ManyToOne
    @JoinColumn(name = "ma_ctsp")
    private ProductDetail productDetail;

    @Column(name = "so_luong")
    private Integer soLuong;

    // Chú ý: Trong sơ đồ của có nối về "MaKhachHang" ở bảng này.
    // Nhưng Cart đã chứa User rồi. 
    // Đây là code nếu cần bám sát
    // @ManyToOne
    // @JoinColumn(name = "ma_khach_hang")
    // private User user;
}