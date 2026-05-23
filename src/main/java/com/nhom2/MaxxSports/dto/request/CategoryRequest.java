package com.nhom2.MaxxSports.dto.request;
import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private Long productTypeId;
}