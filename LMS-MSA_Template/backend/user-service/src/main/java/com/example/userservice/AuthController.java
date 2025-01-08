package com.example.userservice;

import com.amazonaws.services.cognitoidp.model.*;
import com.example.userservice.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CognitoService cognitoService;
    private final UserService userService;

    public AuthController(CognitoService cognitoService, UserService userService) {
        this.cognitoService = cognitoService;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signUp(@RequestBody SignUpRequestDto request) {
        SignUpResult cognitoResult = cognitoService.signUp(request);

        // Cognito 회원가입 성공 시 UserProfile 생성
        UserProfile user = new UserProfile();
        user.setCognitoUsername(request.getEmail()); // SignUpResult에는 username이 없으므로 요청한 이메일을 사용
        user.setCognitoUserId(cognitoResult.getUserSub());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setRole(UserRole.STUDENT);
        userService.createUser(user);

        return ResponseEntity.ok(new SignUpResponseDto(request.getEmail(), cognitoResult.getUserConfirmed()));
    }

    @PostMapping("/login")
    public ResponseEntity<SignInResponseDto> signIn(@RequestBody SignInRequestDto request) {
        try {
            UserProfile user = userService.getUserByEmail(request.getEmail());
            if (!user.isActive()) {
                throw new CustomException(
                        "EMAIL_NOT_VERIFIED",
                        "이메일 인증이 필요합니다. 이메일을 확인해주세요.",
                        HttpStatus.UNAUTHORIZED
                );
            }

            AdminInitiateAuthResult result = cognitoService.signIn(request);
            AuthenticationResultType authResult = result.getAuthenticationResult();

            return ResponseEntity.ok(new SignInResponseDto(
                    authResult.getAccessToken(),
                    authResult.getIdToken(),
                    authResult.getRefreshToken()
            ));
        } catch (UserNotFoundException e) {
            throw new CustomException(
                    "USER_NOT_FOUND",
                    "등록되지 않은 사용자입니다.",
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<SignUpResponseDto> verifyEmail(@Valid @RequestBody VerifyEmailRequestDto request) {
        try {
            UserProfile user = userService.getUserByEmail(request.getEmail());
            if (user.isActive()) {
                throw new CustomException(
                        "ALREADY_VERIFIED",
                        "User is already verified",
                        HttpStatus.BAD_REQUEST
                );
            }

            // 1. Cognito 이메일 인증
            cognitoService.verifyEmail(request);

            // 2. UserProfile 활성화
            user.setActive(true);
            user.setEmailVerified(true);
            userService.updateUser(user);

            return ResponseEntity.ok(new SignUpResponseDto(request.getEmail(), true));
        } catch (AWSCognitoIdentityProviderException e) {
            throw new CustomException(
                    "VERIFICATION_FAILED",
                    "Failed to verify email: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        cognitoService.resendConfirmationCode(email);
        return ResponseEntity.ok().build();
    }
}
