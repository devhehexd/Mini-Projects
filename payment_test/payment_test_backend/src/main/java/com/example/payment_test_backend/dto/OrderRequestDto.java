package com.example.payment_test_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {

    private String studentId;
    private List<OrderItemDto> items;
    private Integer totalAmount;
}

