package com.nhom2.MaxxSports.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class VnpayUtil {

    public static String hmacSHA512(
            String key,
            String data
    ) {

        try {

            Mac hmac512 =
                    Mac.getInstance("HmacSHA512");

            SecretKeySpec secretKeySpec =
                    new SecretKeySpec(
                            key.getBytes(),
                            "HmacSHA512"
                    );

            hmac512.init(secretKeySpec);

            byte[] bytes =
                    hmac512.doFinal(
                            data.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            StringBuilder hash =
                    new StringBuilder();

            for (byte b : bytes) {

                hash.append(
                        String.format("%02x", b)
                );
            }

            return hash.toString();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}