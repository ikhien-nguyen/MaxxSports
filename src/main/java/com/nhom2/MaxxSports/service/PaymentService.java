package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.config.VnpayConfig;
import com.nhom2.MaxxSports.entity.Order;
import com.nhom2.MaxxSports.entity.Payment;
import com.nhom2.MaxxSports.enums.OrderStatus;
import com.nhom2.MaxxSports.enums.PaymentStatus;
import com.nhom2.MaxxSports.repository.OrderRepository;
import com.nhom2.MaxxSports.repository.PaymentRepository;
import com.nhom2.MaxxSports.utils.VnpayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final VnpayConfig vnpayConfig;

    private final OrderRepository orderRepository;

    private final PaymentRepository paymentRepository;

    public String createPaymentUrl(
            String orderId,
            HttpServletRequest request
    ) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy đơn hàng"
                                ));

        Payment payment = order.getPayment();

        String transactionNo =
                payment.getTransactionNo();

        Map<String, String> params =
                new HashMap<>();

        params.put("vnp_Version", "2.1.0");

        params.put("vnp_Command", "pay");

        params.put(
                "vnp_TmnCode",
                vnpayConfig.getTmnCode()
        );

        params.put(
                "vnp_Amount",
                String.valueOf(
                        (long) (
                                order.getTotalPrice() * 100
                        )
                )
        );

        params.put(
                "vnp_CurrCode",
                "VND"
        );

        params.put(
                "vnp_TxnRef",
                transactionNo
        );

        params.put(
                "vnp_OrderInfo",
                "Thanh toan don hang"
        );

        params.put(
                "vnp_OrderType",
                "other"
        );

        params.put(
                "vnp_Locale",
                "vn"
        );

        params.put(
                "vnp_ReturnUrl",
                vnpayConfig.getReturnUrl()
        );

        params.put(
                "vnp_IpAddr",
                request.getRemoteAddr()
        );

        params.put(
                "vnp_CreateDate",
                new SimpleDateFormat(
                        "yyyyMMddHHmmss"
                ).format(new Date())
        );

        List<String> fieldNames =
                new ArrayList<>(params.keySet());

        Collections.sort(fieldNames);

        StringBuilder hashData =
                new StringBuilder();

        StringBuilder query =
                new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {

            String fieldName =
                    fieldNames.get(i);

            String value =
                    params.get(fieldName);

            if (value != null
                    && !value.isEmpty()) {

                // HASH DATA
                hashData.append(fieldName);

                hashData.append("=");

                hashData.append(
                        URLEncoder.encode(
                                value,
                                StandardCharsets.US_ASCII
                        )
                );

                // QUERY
                query.append(
                        URLEncoder.encode(
                                fieldName,
                                StandardCharsets.US_ASCII
                        )
                );

                query.append("=");

                query.append(
                        URLEncoder.encode(
                                value,
                                StandardCharsets.US_ASCII
                        )
                );

                // dấu &
                if (i < fieldNames.size() - 1) {

                    hashData.append("&");

                    query.append("&");
                }
            }
        }

        System.out.println(
                "HASH DATA: " + hashData
        );

        String secureHash =
                VnpayUtil.hmacSHA512(
                        vnpayConfig.getHashSecret(),
                        hashData.toString()
                );

        System.out.println(
                "SECURE HASH: " + secureHash
        );

        query.append("&vnp_SecureHash=");

        query.append(secureHash);

        String paymentUrl =
                vnpayConfig.getPayUrl()
                        + "?"
                        + query;

        System.out.println(
                "PAYMENT URL: " + paymentUrl
        );

        return paymentUrl;
    }

    public String paymentReturn(
            Map<String, String> params
    ) {

        String responseCode =
                params.get("vnp_ResponseCode");

        String transactionNo =
                params.get("vnp_TxnRef");

        Payment payment =
                paymentRepository.findByTransactionNo(
                        transactionNo
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy giao dịch"
                        ));

        Order order =
                payment.getOrder();

        if ("00".equals(responseCode)) {

            payment.setStatus(
                    PaymentStatus.SUCCESS
            );

            order.setOrderStatus(
                    OrderStatus.COMPLETED
            );

        } else {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            order.setOrderStatus(
                    OrderStatus.CANCELLED
            );
        }

        paymentRepository.save(payment);

        orderRepository.save(order);

        return "Thanh toán thành công";
    }
}