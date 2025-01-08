package com.example.courseservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.math.BigDecimal;
import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class CourseService {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private final CourseRepository courseRepository;

    @Autowired
    private S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public String getPresignedUrlForUpload(String originalFilename) {
        String key = "thumbnails/" + UUID.randomUUID() + "_" + originalFilename;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .putObjectRequest(putObjectRequest)
                .signatureDuration(Duration.ofMinutes(15)) // 유효 시간 설정
                .build();

        URL presignedUrl = s3Presigner.presignPutObject(presignRequest).url();
        return presignedUrl.toString();
    }

    public void createCourse(String title, String description, String instructor,
                             String thumbnailUrl, String category, String duration, BigDecimal price) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setInstructor(instructor);
        course.setThumbnailUrl(thumbnailUrl);
        course.setCategory(category);
        course.setDuration(duration);
        course.setPrice(price);

        courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
