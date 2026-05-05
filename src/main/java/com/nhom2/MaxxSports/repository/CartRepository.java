package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Cart;
import com.nhom2.MaxxSports.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    // Tìm giỏ hàng dựa theo người dùng
    Optional<Cart> findByUser(User user);
}