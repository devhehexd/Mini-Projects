package com.example.courseservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }


    @PostMapping("/generate-presigned-url")
    public ResponseEntity<Map<String, String>> generatePresignedUrl(
            @RequestParam("filename") String filename) {
        try {
            String presignedUrl = courseService.getPresignedUrlForUpload(filename);
            Map<String, String> response = new HashMap<>();
            response.put("uploadUrl", presignedUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "프리사인드 URL 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createCourse(@RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String description = request.get("description");
            String instructor = request.get("instructor");
            String thumbnailUrl = request.get("thumbnailUrl");
            String category = request.get("category");
            String duration = request.get("duration");
            BigDecimal price = new BigDecimal(request.get("price"));

            courseService.createCourse(title, description, instructor, thumbnailUrl, category, duration, price);
            Map<String, String> response = new HashMap<>();
            response.put("message", "강의가 성공적으로 생성되었습니다.");
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(400).body(Map.of("error", "가격 형식이 올바르지 않습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "강의 생성에 실패했습니다: " + e.getMessage()));
        }
    }


    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
