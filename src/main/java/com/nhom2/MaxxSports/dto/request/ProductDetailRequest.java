package com.nhom2.MaxxSports.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailRequest {
    Long productId;

    Long sizeId;

    Long mauId;

    Integer soLuong;

    String image;
}