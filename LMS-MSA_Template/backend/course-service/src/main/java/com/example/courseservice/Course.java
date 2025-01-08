package com.example.courseservice;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String instructor; // 강사의 이름
    private BigDecimal price;
    private String thumbnailUrl; // 강의 썸네일 이미지 URL
    private String category; // 강의 카테고리
    private String duration; // 강의의 총 시간 (예: "10 hours")
}
