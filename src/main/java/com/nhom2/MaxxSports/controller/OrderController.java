package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.CheckoutRequest;
import com.nhom2.MaxxSports.dto.response.ApiResponse;
import com.nhom2.MaxxSports.dto.response.OrderResponse;
import com.nhom2.MaxxSports.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderController {

    OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> checkout(
            @RequestBody CheckoutRequest request,
            Principal principal
    ) {

        return ApiResponse
                .<OrderResponse>builder()
                .result(
                        orderService.checkout(
                                principal.getName(),
                                request
                        )
                )
                .build();
    }
}
