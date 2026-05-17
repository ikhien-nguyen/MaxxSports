package com.nhom2.MaxxSports.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailResponse {

    Long maCtsp;

    Integer soLuong;

    String size;

    String mau;

    String image;
}