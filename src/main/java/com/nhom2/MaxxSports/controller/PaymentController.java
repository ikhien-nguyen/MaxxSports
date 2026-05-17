package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/vnpay")
    public String createPayment(
            @RequestParam String orderId,
            HttpServletRequest request
    ) {

        return paymentService.createPaymentUrl(
                orderId,
                request
        );
    }

    @GetMapping("/vnpay-return")
    public String paymentReturn(
            @RequestParam Map<String, String> params
    ) {

        return paymentService.paymentReturn(
                params
        );
    }
}