package com.example.cartservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String instructor; // 강사의 이름
    private String thumbnailUrl;
    private BigDecimal price;
    private String description;
    private String category; // 강의 카테고리
    private boolean isAvailable;
}
