package com.example.payment_test_backend.dto;

import lombok.Data;

@Data
public class WebHookRequestDto {

    private String imp_uid;

    private String merchantUid;

    private String status;

    private Long cancellationId;

}
