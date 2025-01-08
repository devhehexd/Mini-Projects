package com.example.enrollmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnrollmentResponse {
    private Long id;
    private String userId;
    private Course course; // Course 객체 포함
}
