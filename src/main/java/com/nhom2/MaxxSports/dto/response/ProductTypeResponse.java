package com.nhom2.MaxxSports.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductTypeResponse {
    private Long id;
    private String name;
}