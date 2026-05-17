package com.nhom2.MaxxSports.mapper;

import com.nhom2.MaxxSports.dto.request.RegisterRequest;
import com.nhom2.MaxxSports.dto.response.RegisterResponse;
import com.nhom2.MaxxSports.dto.response.UserResponse;
import com.nhom2.MaxxSports.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(RegisterRequest registerRequest);
    RegisterResponse toRegisterResponse(User user);
    UserResponse toUserResponse(User user);
}
