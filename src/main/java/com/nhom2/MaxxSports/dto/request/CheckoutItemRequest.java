package com.nhom2.MaxxSports.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutItemRequest {

    Long productDetailId;

    @Builder.Default
    Integer quantity = 1;
}