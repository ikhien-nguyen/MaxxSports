package com.nhom2.MaxxSports.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi chưa xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    EMAIL_EXISTED(1001, "Email đã tồn tại", HttpStatus.BAD_REQUEST),
    LOGIN_FAILED(1002, "Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1003, "Lỗi đăng nhập", HttpStatus.UNAUTHORIZED),
    ;
    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
