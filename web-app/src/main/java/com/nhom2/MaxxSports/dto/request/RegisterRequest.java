package com.nhom2.MaxxSports.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 50, message = "Tên không được quá 50 ký tự")
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|84)[3|5|7|8|9][0-9]{8}$",
            message = "Số điện thoại không đúng định dạng Việt Nam")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;
}
