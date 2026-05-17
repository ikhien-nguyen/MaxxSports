package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Mau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MauRepository
        extends JpaRepository<Mau, Long> {
}