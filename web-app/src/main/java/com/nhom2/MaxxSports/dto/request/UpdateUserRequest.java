package com.nhom2.MaxxSports.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    @Size(max = 50, message = "Tên không được quá 50 ký tự")
    String name;

    @Pattern(regexp = "^(0|84)[3|5|7|8|9][0-9]{8}$",
            message = "Số điện thoại không đúng định dạng")
    String phone;

    String address;
}
