package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.*;
import com.nhom2.MaxxSports.dto.response.OrderResponse;
import com.nhom2.MaxxSports.entity.*;
import com.nhom2.MaxxSports.enums.*;
import com.nhom2.MaxxSports.mapper.OrderMapper;
import com.nhom2.MaxxSports.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final UserRepository userRepository;

    private final ProductDetailRepository
            productDetailRepository;

    private final OrderRepository
            orderRepository;

    private final PaymentRepository
            paymentRepository;

    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse checkout(
            String email,
            CheckoutRequest request
    ) {

        log.info("Checkout");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bạn cần phải đăng nhập"
                        ));

        Order order = Order.builder()
                .orderDate(LocalDateTime.now())
                .detailAddress(
                        request.getDetailAddress()
                )
                .user(user)
                .orderStatus(
                        request.getPaymentMethod()
                                == PaymentMethod.VNPAY
                                ? OrderStatus.CHO_THANH_TOAN
                                : OrderStatus.PENDING
                )
                .shippingMethod(
                        request.getShippingMethod()
                )
                .build();

        List<OrderDetail> orderDetails =
                new ArrayList<>();

        int totalQuantity = 0;

        double totalPrice = 0;

        for (
                CheckoutItemRequest item
                : request.getItems()
        ) {

            ProductDetail productDetail =
                    productDetailRepository
                            .findById(
                                    item.getProductDetailId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Sản phẩm không tồn tại"
                                    ));

            // kiểm tra tồn kho
            if (
                    productDetail.getSoLuong()
                            < item.getQuantity()
            ) {

                throw new RuntimeException(
                        "Sản phẩm không đủ số lượng"
                );
            }

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

            // trừ số lượng tồn
            productDetail.setSoLuong(
                    productDetail.getSoLuong()
                            - item.getQuantity()
            );

            productDetailRepository
                    .save(productDetail);
        }

        order.setOrderDetails(orderDetails);

        order.setTotalQuantity(
                totalQuantity
        );

        order.setTotalPrice(
                totalPrice
        );

        orderRepository.save(order);

        Payment payment = Payment.builder()
                .order(order)
                .amount(totalPrice)
                .method(
                        request.getPaymentMethod()
                )
                .status(
                        PaymentStatus.PENDING
                )
                .transactionNo(
                        UUID.randomUUID()
                                .toString()
                )
                .build();

        paymentRepository.save(payment);

        order.setPayment(payment);

        return orderMapper.toResponse(order);
    }

    public List<OrderResponse> getMyOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        return orderRepository.findByUser(user)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(orderMapper::toResponse).toList();
    }

    public String updateOrder(UpdateOrderRequest request) {
        var order= orderRepository.findById(request.getId()).orElseThrow(()->new RuntimeException("Đơn hàng không tồn tại"));

        order.setOrderStatus(request.getStatus());

        orderRepository.save(order);
        return "Cập nhập đơn hàng thành công";
    }
}