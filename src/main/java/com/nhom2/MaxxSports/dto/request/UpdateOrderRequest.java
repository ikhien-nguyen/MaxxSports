package com.nhom2.MaxxSports.dto.request;

import com.nhom2.MaxxSports.enums.OrderStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateOrderRequest {
    String id;
    OrderStatus status;
}
