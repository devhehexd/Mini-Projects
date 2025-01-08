package com.example.payment_test_backend.dto;

import lombok.Data;

@Data
public class PaymentResponseDto {

    private int code;

    private String message;

    private PortOnePaymentDto response;
}
