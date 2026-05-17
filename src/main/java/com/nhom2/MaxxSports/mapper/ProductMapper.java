package com.nhom2.MaxxSports.mapper;


import com.nhom2.MaxxSports.dto.request.ProductRequest;
import com.nhom2.MaxxSports.dto.response.ProductDetailResponse;
import com.nhom2.MaxxSports.dto.response.ProductResponse;
import com.nhom2.MaxxSports.entity.Product;
import com.nhom2.MaxxSports.entity.ProductDetail;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring",
        uses = ProductDetailMapper.class
)
public interface ProductMapper {
    Product toProduct(ProductRequest productRequest);
    ProductResponse toProductResponse(Product product);
}
