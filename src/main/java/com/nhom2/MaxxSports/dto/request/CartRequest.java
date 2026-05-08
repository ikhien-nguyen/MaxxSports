package com.nhom2.MaxxSports.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {

    Long maCtsp;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    Integer soLuong;
}