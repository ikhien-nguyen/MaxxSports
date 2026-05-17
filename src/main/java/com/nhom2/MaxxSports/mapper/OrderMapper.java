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

    @Mapping(
            target = "paymentMethod",
            source = "payment.method"
    )

    @Mapping(
            target = "paymentStatus",
            source = "payment.status"
    )

    @Mapping(
            target = "items",
            source = "orderDetails"
    )

    OrderResponse toResponse(
            Order order
    );
}