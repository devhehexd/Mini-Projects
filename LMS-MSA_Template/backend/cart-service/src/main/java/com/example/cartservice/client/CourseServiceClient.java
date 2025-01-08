package com.example.cartservice.client;

import com.example.cartservice.dto.CourseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "course-service")
public interface CourseServiceClient {
    @GetMapping("/api/courses/{courseId}")
    CourseResponse getCourse(@PathVariable Long courseId);
}
