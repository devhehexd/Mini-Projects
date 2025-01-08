package com.example.enrollmentservice.dto;

import lombok.Data;

@Data
public class Course {
   private Long id;
   private String title;
   private String description;
   private String instructor;
   private String thumbnailUrl;
}
