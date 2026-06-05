package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "LOAI_SAN_PHAM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaLoai")
    private Long id;

    @Column(name = "TenLoai", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String name;

    // Quan hệ Một - Nhiều với DANH_MUC (Category)
    @OneToMany(mappedBy = "productType", cascade = CascadeType.ALL)
    private List<Category> categories;
}