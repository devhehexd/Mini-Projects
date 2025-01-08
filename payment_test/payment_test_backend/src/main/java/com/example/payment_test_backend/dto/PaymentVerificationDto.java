package com.example.payment_test_backend.dto;

import lombok.Data;

@Data
public class PaymentVerificationDto {

    private String impUid;

    private String merchantUid;

    private String buyerName;

    private Integer amount;

    private String status;

    private String payMethod;

}
