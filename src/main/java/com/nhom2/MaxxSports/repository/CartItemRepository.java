package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Cart;
import com.nhom2.MaxxSports.entity.CartItem;
import com.nhom2.MaxxSports.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductDetail(Cart cart, ProductDetail productDetail);
    List<CartItem> findByCart(Cart cart);
}