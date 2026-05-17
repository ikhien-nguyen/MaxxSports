package com.nhom2.MaxxSports.mapper;

import com.nhom2.MaxxSports.dto.response.OrderResponse;
import com.nhom2.MaxxSports.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = OrderItemMapper.class
)
public interface OrderMapper {

    @Mapping(
            target = "orderId",
            source = "id"
    )

//    @Mapping(
//            target = "province",
//            source = "province.name"
//    )

//    @Mapping(
//            target = "ward",
//            source = "ward.name"
//    )

    @Mapping(
            target = "detailAddress",
            source = "detailAddress"
    )

    @Mapping(
            target = "totalQuantity",
            source = "totalQuantity"
    )

    @Mapping(
            target = "totalPrice",
            source = "totalPrice"
    )

    @Mapping(
            target = "orderStatus",
            source = "orderStatus"
    )

    @Mapping(
            target = "shippingMethod",
            source = "shippingMethod"
    )

//    @Mapping(
//            target = "paymentMethod",
//            source = "payment.paymentMethod"
//    )

//    @Mapping(
//            target = "paymentStatus",
//            source = "payment.paymentStatus"
//    )

    @Mapping(
            target = "items",
            source = "orderDetails"
    )

    OrderResponse toResponse(
            Order order
    );
}