package com.nhom2.MaxxSports.mapper;

import com.nhom2.MaxxSports.dto.request.ProductRequest;
import com.nhom2.MaxxSports.dto.response.ProductResponse;
import com.nhom2.MaxxSports.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = ProductDetailMapper.class
)
public interface ProductMapper {

    Product toProduct(
            ProductRequest productRequest
    );

    @Mapping(
            target = "thumbnail",
            expression = "java(product.getThumbnail())"
    )
    ProductResponse toProductResponse(
            Product product
    );
}