package com.nhom2.MaxxSports.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Long productTypeId;
    private String productTypeName;
}