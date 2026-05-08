package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.UpdateUserRequest;
import com.nhom2.MaxxSports.dto.response.UpdateUserResponse;
import com.nhom2.MaxxSports.dto.response.UserResponse;
import com.nhom2.MaxxSports.entity.User;
import com.nhom2.MaxxSports.exception.AppException;
import com.nhom2.MaxxSports.exception.ErrorCode;
import com.nhom2.MaxxSports.mapper.UserMapper;
import com.nhom2.MaxxSports.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    public UpdateUserResponse updateUser(UpdateUserRequest request) {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setName(request.getName());
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        userRepository.save(user);

        return UpdateUserResponse.builder()
                .phone(request.getPhone())
                .name(request.getName())
                .address(request.getAddress())
                .build();
    }

    public List<UserResponse> getAllUser(){
        return userRepository.findAll().stream().map(userMapper :: toUserResponse ).toList();
    }

    public UserResponse getUserById(String id){
        var user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public void deleteUserById(String id){
        userRepository.deleteById(id);
    }
}
