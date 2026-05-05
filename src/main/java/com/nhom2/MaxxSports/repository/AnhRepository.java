package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Anh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnhRepository extends JpaRepository<Anh, Long> {
    // Tìm tất cả ảnh của một chi tiết sản phẩm cụ thể
    List<Anh> findByProductDetail_MaCtsp(Long maCtsp);
}