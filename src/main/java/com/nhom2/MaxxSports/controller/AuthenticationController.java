package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.ChangePasswordRequest;
import com.nhom2.MaxxSports.dto.request.LoginRequest;
import com.nhom2.MaxxSports.dto.request.RegisterRequest;
import com.nhom2.MaxxSports.dto.response.ApiResponse;
import com.nhom2.MaxxSports.dto.response.ChangePasswordResponse;
import com.nhom2.MaxxSports.dto.response.LoginResponse;
import com.nhom2.MaxxSports.dto.response.RegisterResponse;
import com.nhom2.MaxxSports.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> registerUser(@RequestBody @Valid RegisterRequest registerRequest) {
        return ApiResponse.<RegisterResponse>builder()
                .result(authenticationService.register(registerRequest))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> loginUser(@RequestBody @Valid LoginRequest loginRequest) {
        return ApiResponse.<LoginResponse>builder()
                .result(authenticationService.login(loginRequest))
                .build();
    }
    @PostMapping("changePassword")
    public ApiResponse<ChangePasswordResponse> changePassword(@RequestBody @Valid ChangePasswordRequest changePasswordRequest) {
        return ApiResponse.<ChangePasswordResponse>builder()
                .result(authenticationService.changePassword(changePasswordRequest))
                .build();
    }

    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String authHeader) throws ParseException, JOSEException {

        String token = authHeader.replace("Bearer ", "");

        authenticationService.logout(token);

        return "Logout thành công";
    }
}
