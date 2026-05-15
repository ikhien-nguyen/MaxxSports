package com.nhom2.MaxxSports.entity;

import com.nhom2.MaxxSports.enums.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    LocalDateTime orderDate;

    String detailAddress;

    Integer totalQuantity;

    Double totalPrice;

    @Enumerated(EnumType.STRING)
    OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    ShippingMethod shippingMethod;

//    @ManyToOne
//    @JoinColumn(name = "ward_id")
//    Ward ward;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "order",
            cascade = CascadeType.ALL)
    List<OrderDetail> orderDetails;

//    @OneToOne(mappedBy = "order",
//            cascade = CascadeType.ALL)
//    Payment payment;
}