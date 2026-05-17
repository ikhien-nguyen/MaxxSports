package com.nhom2.MaxxSports.dto.request;

import com.nhom2.MaxxSports.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

//    Integer provinceId;

//    Integer wardId;
    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    String detailAddress;

    @NotNull(message = "Chọn phương thức thanh toán")
    PaymentMethod paymentMethod;

    @NotNull(message = "Phương thức giao hàng không được để trống")
    ShippingMethod shippingMethod;

    List<CheckoutItemRequest> items;
}