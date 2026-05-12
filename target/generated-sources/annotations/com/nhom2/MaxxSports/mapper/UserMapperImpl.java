package com.nhom2.MaxxSports.mapper;

import com.nhom2.MaxxSports.dto.request.RegisterRequest;
import com.nhom2.MaxxSports.dto.response.RegisterResponse;
import com.nhom2.MaxxSports.dto.response.UserResponse;
import com.nhom2.MaxxSports.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-12T07:40:16+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(RegisterRequest registerRequest) {
        if ( registerRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.address( registerRequest.getAddress() );
        user.email( registerRequest.getEmail() );
        user.name( registerRequest.getName() );
        user.password( registerRequest.getPassword() );
        user.phone( registerRequest.getPhone() );

        return user.build();
    }

    @Override
    public RegisterResponse toRegisterResponse(User user) {
        if ( user == null ) {
            return null;
        }

        RegisterResponse.RegisterResponseBuilder registerResponse = RegisterResponse.builder();

        registerResponse.address( user.getAddress() );
        registerResponse.email( user.getEmail() );
        registerResponse.name( user.getName() );
        registerResponse.password( user.getPassword() );
        registerResponse.phone( user.getPhone() );
        registerResponse.role( user.getRole() );

        return registerResponse.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.address( user.getAddress() );
        userResponse.email( user.getEmail() );
        userResponse.id( user.getId() );
        userResponse.name( user.getName() );
        userResponse.phone( user.getPhone() );
        userResponse.role( user.getRole() );

        return userResponse.build();
    }
}
