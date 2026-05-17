package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.UpdateUserRequest;
import com.nhom2.MaxxSports.dto.response.ApiResponse;
import com.nhom2.MaxxSports.dto.response.UpdateUserResponse;
import com.nhom2.MaxxSports.dto.response.UserResponse;
import com.nhom2.MaxxSports.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/update")
    public ApiResponse<UpdateUserResponse> updateUser(UpdateUserRequest request) {
        return ApiResponse.<UpdateUserResponse>builder()
                .result(userService.updateUser(request))
                .build();
    }

    @GetMapping("/getAllUsers")
    public ApiResponse<List<UserResponse>> getAllUser(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUser())
                .build();
    }

    @GetMapping("/getUser/{id}")
    public ApiResponse<UserResponse> getUser(@PathVariable String id){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .build();
    }

    @DeleteMapping("/deleteUser/{id}")
    public void deleteUser(@PathVariable String id){
        log.info("Deleting user with id: " + id);
        userService.deleteUserById(id);
    }
}
