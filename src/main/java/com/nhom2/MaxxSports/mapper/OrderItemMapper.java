package com.nhom2.MaxxSports.mapper;

import com.nhom2.MaxxSports.dto.response.OrderItemResponse;
import com.nhom2.MaxxSports.entity.Images;
import com.nhom2.MaxxSports.entity.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(
            target = "productDetailId",
            source = "productDetail.maCtsp"
    )

    @Mapping(
            target = "productName",
            source = "productDetail.product.tenSanPham"
    )

    @Mapping(
            target = "size",
            source = "productDetail.size.size"
    )

    @Mapping(
            target = "color",
            source = "productDetail.mau.mau"
    )

    @Mapping(
            target = "quantity",
            source = "quantity"
    )

    @Mapping(
            target = "price",
            source = "price"
    )

    @Mapping(
            target = "totalPrice",
            source = "totalPrice"
    )

    @Mapping(
            target = "imageUrl",
            expression =
                    "java(getImageUrl(orderDetail))"
    )

    OrderItemResponse toResponse(
            OrderDetail orderDetail
    );

    default String getImageUrl(
            OrderDetail orderDetail
    ) {

        if (orderDetail.getProductDetail()
                .getImages() == null
        ) {

            return null;
        }

        if (orderDetail.getProductDetail()
                .getImages()
                .isEmpty()) {

            return null;
        }

        Images image =
                orderDetail.getProductDetail()
                        .getImages()
                        .get(0);

        return image.getUrl();
    }
}