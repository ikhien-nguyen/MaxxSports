package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Images;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Images, String> {
    List<Images> findByProductDetail_MaCtsp(Long maCtsp);
}
