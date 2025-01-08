package com.example.cartservice.repository;

import com.example.cartservice.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(String userId);
    Optional<Cart> findByUserIdAndCourseId(String userId, Long courseId);
    void deleteByUserIdAndId(String userId, Long id);
    void deleteByUserId(String userId);
}