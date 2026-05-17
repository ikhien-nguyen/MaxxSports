package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTransactionNo(
            String transactionNo
    );
}