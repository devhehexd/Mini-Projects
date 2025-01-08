package com.example.userservice;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.example.userservice.dto.SignInRequestDto;
import com.example.userservice.dto.SignUpRequestDto;
import com.example.userservice.dto.SignUpResponseDto;
import com.example.userservice.dto.VerifyEmailRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class CognitoService {
    private final AWSCognitoIdentityProvider cognitoClient;
    private final String userPoolId;
    private final String clientId;
    private final String clientSecret;

    public CognitoService(
            AWSCognitoIdentityProvider cognitoClient,
            @Value("${aws.cognito.userPoolId}") String userPoolId,
            @Value("${aws.cognito.clientId}") String clientId,
            @Value("${aws.cognito.clientSecret}") String clientSecret) {
        this.cognitoClient = cognitoClient;
        this.userPoolId = userPoolId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private String calculateSecretHash(String username) {
        final String message = username + clientId;
        final SecretKeySpec signingKey = new SecretKeySpec(
                clientSecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating secret hash", e);
        }
    }

    public SignUpResult signUp(SignUpRequestDto request) {
        try {
            SignUpRequest signUpRequest = new SignUpRequest()
                    .withClientId(clientId)
                    .withUsername(request.getEmail())
                    .withPassword(request.getPassword())
                    .withSecretHash(calculateSecretHash(request.getEmail()))
                    .withUserAttributes(
                            new AttributeType().withName("email").withValue(request.getEmail()),
                            new AttributeType().withName("name").withValue(request.getName())
                    );

            return cognitoClient.signUp(signUpRequest);
        } catch (AWSCognitoIdentityProviderException e) {
            log.error("Cognito signup error", e);
            throw new RuntimeException("Failed to sign up user", e);
        }
    }


    public AdminInitiateAuthResult signIn(SignInRequestDto request) {
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", request.getEmail());
            authParams.put("PASSWORD", request.getPassword());
            authParams.put("SECRET_HASH", calculateSecretHash(request.getEmail()));

            AdminInitiateAuthRequest authRequest = new AdminInitiateAuthRequest()
                    .withAuthFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)  // ADMIN_USER_PASSWORD_AUTH 대신 사용
                    .withUserPoolId(userPoolId)
                    .withClientId(clientId)
                    .withAuthParameters(authParams);

            return cognitoClient.adminInitiateAuth(authRequest);
        } catch (NotAuthorizedException e) {
            log.error("Login failed for user: {}", request.getEmail(), e);
            throw new CustomException(
                    "INVALID_CREDENTIALS",
                    "이메일 또는 비밀번호가 올바르지 않습니다.",
                    HttpStatus.UNAUTHORIZED
            );
        } catch (UserNotFoundException e) {
            log.error("User not found: {}", request.getEmail(), e);
            throw new CustomException(
                    "USER_NOT_FOUND",
                    "사용자를 찾을 수 없습니다.",
                    HttpStatus.NOT_FOUND
            );
        } catch (AWSCognitoIdentityProviderException e) {
            log.error("Cognito signin error", e);
            throw new CustomException(
                    "LOGIN_FAILED",
                    "로그인 처리 중 오류가 발생했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public void verifyEmail(VerifyEmailRequestDto request) {
        if (request.getEmail() == null || request.getConfirmationCode() == null) {
            throw new CustomException(
                    "INVALID_INPUT",
                    "Email and confirmation code are required",
                    HttpStatus.BAD_REQUEST
            );
        }

        try {
            // 사용자 상태 확인
            AdminGetUserRequest getUserRequest = new AdminGetUserRequest()
                    .withUserPoolId(userPoolId)
                    .withUsername(request.getEmail());

            AdminGetUserResult userResult = cognitoClient.adminGetUser(getUserRequest);

            if ("CONFIRMED".equals(userResult.getUserStatus())) {
                throw new CustomException(
                        "ALREADY_VERIFIED",
                        "User is already verified",
                        HttpStatus.BAD_REQUEST
                );
            }

            ConfirmSignUpRequest confirmSignUpRequest = new ConfirmSignUpRequest()
                    .withClientId(clientId)
                    .withUsername(request.getEmail())
                    .withConfirmationCode(request.getConfirmationCode())
                    .withSecretHash(calculateSecretHash(request.getEmail()));

            cognitoClient.confirmSignUp(confirmSignUpRequest);
        } catch (UserNotFoundException e) {
            throw new CustomException(
                    "USER_NOT_FOUND",
                    "User not found",
                    HttpStatus.NOT_FOUND
            );
        } catch (AWSCognitoIdentityProviderException e) {
            log.error("Cognito email verification error", e);
            throw new CustomException(
                    "VERIFICATION_FAILED",
                    "Failed to verify email: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    public void resendConfirmationCode(String email) {
        try {
            ResendConfirmationCodeRequest request = new ResendConfirmationCodeRequest()
                    .withClientId(clientId)
                    .withUsername(email)
                    .withSecretHash(calculateSecretHash(email));

            cognitoClient.resendConfirmationCode(request);
        } catch (AWSCognitoIdentityProviderException e) {
            log.error("Cognito resend confirmation code error", e);
            throw new RuntimeException("Failed to resend confirmation code", e);
        }
    }
}
