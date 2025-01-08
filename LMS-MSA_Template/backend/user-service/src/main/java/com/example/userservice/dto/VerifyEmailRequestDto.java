package com.example.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VerifyEmailRequestDto {
    @NotNull(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Confirmation code is required")
    @Size(min = 6, max = 6, message = "Confirmation code must be 6 characters")
    private String confirmationCode;

    private String name;
}