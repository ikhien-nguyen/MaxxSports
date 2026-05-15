package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository
        extends JpaRepository<OrderDetail, String> {
}
