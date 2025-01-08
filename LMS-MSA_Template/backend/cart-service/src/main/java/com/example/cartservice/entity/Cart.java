package com.example.cartservice.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "carts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private String instructor;

    @Column(nullable = false)
    private BigDecimal price;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    public Cart(String userId, Long courseId, String courseName, String instructor, BigDecimal price) {
        this.userId = userId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.instructor = instructor;
        this.price = price;
    }
}
