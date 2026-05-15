package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.*;
import com.nhom2.MaxxSports.dto.response.OrderResponse;
import com.nhom2.MaxxSports.entity.*;
import com.nhom2.MaxxSports.enums.*;
import com.nhom2.MaxxSports.mapper.OrderMapper;
import com.nhom2.MaxxSports.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;

    private final ProductDetailRepository
            productDetailRepository;

//    private final ProvinceRepository
//            provinceRepository;
//
//    private final WardRepository
//            wardRepository;

    private final OrderRepository
            orderRepository;
//
//    private final PaymentRepository
//            paymentRepository;

    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse checkout(
            String email,
            CheckoutRequest request
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bạn cần phải đăng nhập"
                        ));
//
//        Province province =
//                provinceRepository.findById(
//                        request.getProvinceId()
//                ).orElseThrow(() ->
//                        new RuntimeException(
//                                "Province không tồn tại"
//                        ));
//
//        Ward ward =
//                wardRepository.findById(
//                        request.getWardId()
//                ).orElseThrow(() ->
//                        new RuntimeException(
//                                "Ward không tồn tại"
//                        ));
//
//        if (!ward.getProvince().getId()
//                .equals(province.getId())) {
//
//            throw new RuntimeException(
//                    "Ward không thuộc province"
//            );
//        }
        Order order = Order.builder()
                .orderDate(LocalDateTime.now())
                .detailAddress(
                        request.getDetailAddress()
                )
//                .province(province)
//                .ward(ward)
                .user(user)
                .orderStatus(
                        OrderStatus.PENDING
                )
                .shippingMethod(
                        request.getShippingMethod()
                )
                .build();
        List<OrderDetail> orderDetails =
                new ArrayList<>();
        int totalQuantity = 0;
        double totalPrice = 0;
        for (CheckoutItemRequest item :
                request.getItems()) {
            ProductDetail productDetail =
                    productDetailRepository
                            .findById(
                                    item.getProductDetailId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Sản phẩm không tồn tại"
                                    ));
            double price =
                    productDetail.getProduct()
                            .getGia();
            double itemTotal =
                    price * item.getQuantity();

            OrderDetail orderDetail =
                    OrderDetail.builder()
                            .order(order)
                            .productDetail(productDetail)
                            .quantity(
                                    item.getQuantity()
                            )
                            .price(price)
                            .totalPrice(itemTotal)
                            .build();

            orderDetails.add(orderDetail);

            totalQuantity +=
                    item.getQuantity();

            totalPrice += itemTotal;
        }

        order.setOrderDetails(orderDetails);

        order.setTotalQuantity(
                totalQuantity
        );

        order.setTotalPrice(
                totalPrice
        );

        orderRepository.save(order);
//
//        Payment payment = Payment.builder()
//                .order(order)
//                .paymentMethod(
//                        request.getPaymentMethod()
//                )
//                .paymentStatus(
//                        request.getPaymentMethod()
//                                == PaymentMethod.COD
//                                ? PaymentStatus.PENDING
//                                : PaymentStatus.PAID
//                )
//                .transactionCode(
//                        UUID.randomUUID()
//                                .toString()
//                )
//                .paidAt(
//                        request.getPaymentMethod()
//                                == PaymentMethod.COD
//                                ? null
//                                : LocalDateTime.now()
//                )
//                .build();
//
//        paymentRepository.save(payment);
//
//        order.setPayment(payment);

        return orderMapper.toResponse(order);
    }

    public List<OrderResponse> getMyOrders(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy user"
                        ));

        return orderRepository.findByUser(user)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }
}