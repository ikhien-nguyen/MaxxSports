
package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByTenSanPhamContainingIgnoreCase(String keyword);

    List<Product> findByLoaiSanPhamIgnoreCase(String loaiSanPham);

    List<Product> findByThuongHieuIgnoreCase(String thuongHieu);

    List<Product> findByLoaiSanPhamIgnoreCase(
            String loaiSanPham,
            Sort sort
    );
}