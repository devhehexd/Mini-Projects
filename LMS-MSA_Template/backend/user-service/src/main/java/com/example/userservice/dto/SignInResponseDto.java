package com.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignInResponseDto {
    private String accessToken;
    private String idToken;
    private String refreshToken;
}
