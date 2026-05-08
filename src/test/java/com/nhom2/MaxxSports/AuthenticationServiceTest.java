package com.nhom2.MaxxSports;

import com.nhom2.MaxxSports.dto.request.LoginRequest;
import com.nhom2.MaxxSports.dto.response.LoginResponse;
import com.nhom2.MaxxSports.entity.User;
import com.nhom2.MaxxSports.repository.UserRepository;
import com.nhom2.MaxxSports.service.AuthenticationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User mockUser;
    private final String TEST_EMAIL = "khachhang@gmail.com";
    private final String TEST_PASSWORD = "Password123@";

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setEmail(TEST_EMAIL);
        mockUser.setPassword("encodedPasswordFromDB");

        // Cấu hình giả cho JWT
        String dummySignerKey = "1234567890123456789012345678901234567890123456789012345678901234";
        ReflectionTestUtils.setField(authenticationService, "SIGNER_KEY", dummySignerKey);
        ReflectionTestUtils.setField(authenticationService, "VALID_DURATION", 1L);
    }

    @Test
    void login_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(TEST_PASSWORD, mockUser.getPassword())).thenReturn(true);

        LoginResponse response = authenticationService.login(loginRequest);

        assertNotNull(response);
        assertTrue(response.isChecked());
        assertNotNull(response.getToken()); 
    }
}