package com.nhom2.MaxxSports.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nhom2.MaxxSports.enums.OrderStatus;
import com.nhom2.MaxxSports.enums.ShippingMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {

    String orderId;
    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm:ss"
    )
    LocalDateTime orderDate;

    String province;

//    String ward;

    String detailAddress;

    Integer totalQuantity;

    Double totalPrice;

    OrderStatus orderStatus;

    ShippingMethod shippingMethod;

//    PaymentMethod paymentMethod;
//
//    PaymentStatus paymentStatus;

    List<OrderItemResponse> items;
}