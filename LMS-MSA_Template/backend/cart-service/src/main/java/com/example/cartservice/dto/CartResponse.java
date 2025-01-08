package com.example.cartservice.dto;

import com.example.cartservice.entity.Cart;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class CartResponse {
    private Long id;
    private Long courseId;
    private String courseName;
    private String instructor;
    private BigDecimal price;

    public static CartResponse from(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .courseId(cart.getId())
                .courseName(cart.getCourseName())
                .instructor(cart.getInstructor())
                .price(cart.getPrice())
                .build();
    }
}
