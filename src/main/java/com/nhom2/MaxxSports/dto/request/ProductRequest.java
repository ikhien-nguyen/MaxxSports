package com.nhom2.MaxxSports.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;

    @NotBlank(message = "Mô tả không được để trống")
    private String moTa;

    @NotBlank(message = "Thương hiệu không được để trống")
    private String thuongHieu;

    @NotBlank(message = "Chất liệu không được để trống")
    private String chatLieu;

    @NotBlank(message = "Loại sản phẩm không được để trống")
    private String loaiSanPham;

    @NotNull(message = "Giá không được để trống")

    @DecimalMin(
            value = "0",
            inclusive = false,
            message = "Giá phải lớn hơn 0"
    )
    private Double gia;
}