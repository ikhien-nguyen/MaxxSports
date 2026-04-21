package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.ChangePasswordRequest;
import com.nhom2.MaxxSports.dto.request.LoginRequest;
import com.nhom2.MaxxSports.dto.request.RegisterRequest;
import com.nhom2.MaxxSports.dto.response.ChangePasswordResponse;
import com.nhom2.MaxxSports.dto.response.LoginResponse;
import com.nhom2.MaxxSports.dto.response.RegisterResponse;
import com.nhom2.MaxxSports.entity.InvalidatedToken;
import com.nhom2.MaxxSports.entity.User;
import com.nhom2.MaxxSports.exception.AppException;
import com.nhom2.MaxxSports.exception.ErrorCode;
import com.nhom2.MaxxSports.mapper.UserMapper;
import com.nhom2.MaxxSports.repository.InvalidatedTokenRepository;
import com.nhom2.MaxxSports.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public RegisterResponse register(RegisterRequest registerRequest) {
        User user = userMapper.toUser(registerRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        return userMapper.toRegisterResponse(user);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()->new AppException(ErrorCode.LOGIN_FAILED));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.LOGIN_FAILED);
        }
        var token = generateToken(user);
        return LoginResponse.builder()
                .checked(true)
                .token(token)
                .build();
    }

    public void logout(String token) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(token, true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidatedTokenRepository.save(invalidatedToken);
            log.info("Logout successful");
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }

    public ChangePasswordResponse changePassword(ChangePasswordRequest changePasswordRequest) {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user= userRepository.findByEmail(email).orElseThrow(()->new AppException(ErrorCode.LOGIN_FAILED));
        boolean check = passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword());
        ChangePasswordResponse changePasswordResponse;
        if (!check) {
            changePasswordResponse = ChangePasswordResponse.builder()
                    .message("Mật khẩu cũ không đúng")
                    .build();
        }else{
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            userRepository.save(user);
            changePasswordResponse = ChangePasswordResponse.builder()
                    .message("Đổi mật khẩu thành công")
                    .build();
        }

        return changePasswordResponse;
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("XSport")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRole().name())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
}
