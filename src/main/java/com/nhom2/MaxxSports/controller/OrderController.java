package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.CheckoutRequest;
import com.nhom2.MaxxSports.dto.request.UpdateOrderRequest;
import com.nhom2.MaxxSports.dto.response.ApiResponse;
import com.nhom2.MaxxSports.dto.response.OrderResponse;
import com.nhom2.MaxxSports.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderController {

    OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> checkout(@RequestBody CheckoutRequest request, Principal principal) {
        System.out.println("CALL CONTROLLER");

        System.out.println(principal);
        return ApiResponse
                .<OrderResponse>builder()
                .result(orderService.checkout(principal.getName(), request))
                .build();
    }

    @GetMapping("/myOrders")
    public ApiResponse<List<OrderResponse>> getMyOrders(Principal principal) {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getMyOrders(principal.getName()))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/status")
    public ApiResponse<String> updateOrder(@RequestBody UpdateOrderRequest request) {
        return ApiResponse.<String>builder()
                .result(orderService.updateOrder(request))
                .build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getAllOrders")
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getAllOrders())
                .build();
    }
}
