package com.example.userservice.dto;

import lombok.Data;

@Data
public class SignInRequestDto {
    private String email;
    private String password;
}
