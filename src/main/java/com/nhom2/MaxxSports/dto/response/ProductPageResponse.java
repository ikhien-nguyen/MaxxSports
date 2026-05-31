package com.nhom2.MaxxSports.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPageResponse {

    private List<ProductResponse> content;

    private int currentPage;

    private int totalPages;

    private long totalItems;
}