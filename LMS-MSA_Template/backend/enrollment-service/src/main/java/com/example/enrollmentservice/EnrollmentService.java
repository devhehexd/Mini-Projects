package com.example.enrollmentservice;

import com.example.enrollmentservice.dto.Course;
import com.example.enrollmentservice.dto.EnrollmentResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseClient courseClient;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseClient courseClient) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseClient = courseClient;
    }

    public List<EnrollmentResponse> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        List<EnrollmentResponse> responses = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Course course = courseClient.getCourseById(enrollment.getCourseId());
            EnrollmentResponse response = new EnrollmentResponse(
                    enrollment.getId(),
                    enrollment.getUserId(),
                    course // Course 객체 포함
            );
            responses.add(response);
        }

        return responses;
    }

    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id).orElse(null);
    }

    public void enrollInCourse(String userId, Long courseId) {
        // 이미 수강신청 여부 확인
        boolean exists = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
        if (exists) {
            throw new RuntimeException("이미 수강신청된 강의입니다.");
        }

        // 수강신청 정보 저장
        Enrollment enrollment = Enrollment.builder().userId(userId).courseId(courseId).build();
        enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }
}
