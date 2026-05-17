package com.nhom2.MaxxSports.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {

    String productDetailId;

    String productName;

    String size;

    String color;

    Integer quantity;

    Double price;

    Double totalPrice;

    String imageUrl;
}