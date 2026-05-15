package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepository
        extends JpaRepository<Size, Long> {
}