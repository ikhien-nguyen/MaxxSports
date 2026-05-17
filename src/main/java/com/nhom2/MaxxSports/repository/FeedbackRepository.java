package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Feedback;
import com.nhom2.MaxxSports.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Lấy danh sách đánh giá của một sản phẩm nhất định, xếp cái mới nhất lên đầu
    List<Feedback> findByProductDetailOrderByNgayDangDesc(ProductDetail productDetail);

    // Lấy tất cả đánh giá trong hệ thống và xếp mới nhất lên đầu (cho Admin)
    List<Feedback> findAllByOrderByNgayDangDesc();
}