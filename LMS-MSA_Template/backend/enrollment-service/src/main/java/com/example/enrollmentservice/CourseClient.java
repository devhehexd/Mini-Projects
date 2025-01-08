package com.example.enrollmentservice;

import com.example.enrollmentservice.dto.Course;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "course-service")
public interface CourseClient {
    @GetMapping("/api/courses/{id}")
    Course getCourseById(@PathVariable("id") Long courseId);
}
