package com.nhom2.MaxxSports.mapper;

import com.nhom2.MaxxSports.dto.request.ProductDetailRequest;
import com.nhom2.MaxxSports.dto.response.ProductDetailResponse;
import com.nhom2.MaxxSports.entity.ProductDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductDetailMapper {

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "images", ignore = true)
    ProductDetail toEntity(ProductDetailRequest request);

    @Mapping(target = "size", source = "size.size")
    @Mapping(target = "mau", source = "mau.mau")
    @Mapping(target = "image", ignore = true)
    ProductDetailResponse toResponse(ProductDetail productDetail);
}