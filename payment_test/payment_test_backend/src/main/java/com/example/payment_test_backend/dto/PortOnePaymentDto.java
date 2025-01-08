package com.example.payment_test_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PortOnePaymentDto {

    @JsonProperty("imp_uid")
    private String impUid;

    @JsonProperty("merchant_uid")
    private String merchantUid;

    private String status;

    private String name;

    private Integer amount;

    @JsonProperty("pay_method")
    private String payMethod;

}
