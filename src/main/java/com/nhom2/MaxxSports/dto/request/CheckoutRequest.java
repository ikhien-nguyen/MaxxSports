package com.nhom2.MaxxSports.dto.request;

import com.nhom2.MaxxSports.enums.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutRequest {

    Integer provinceId;

//    Integer wardId;

    String detailAddress;

//    PaymentMethod paymentMethod;

    ShippingMethod shippingMethod;

    List<CheckoutItemRequest> items;
}