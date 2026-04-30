
package com.nhom2.MaxxSports.repository;

import com.nhom2.MaxxSports.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

// thao tác DB trực tiếp
public interface ProductRepository extends JpaRepository<Product, Long> {

}