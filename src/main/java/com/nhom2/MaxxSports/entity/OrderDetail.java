package com.nhom2.MaxxSports.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_detail")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    Integer quantity;

    Double price;

    Double totalPrice;

    @ManyToOne
    @JoinColumn(name = "order_id")
    Order order;

    @ManyToOne
    @JoinColumn(name = "product_detail_id")
    ProductDetail productDetail;
}