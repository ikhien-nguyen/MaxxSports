package com.nhom2.MaxxSports.dto.response;

import com.nhom2.MaxxSports.entity.Roles;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterResponse {
    String email;
    String password;
    String name;
    String phone;
    String address;
    Roles role;
}
