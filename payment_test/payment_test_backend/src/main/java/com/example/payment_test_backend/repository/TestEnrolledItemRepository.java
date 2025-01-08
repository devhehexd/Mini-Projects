package com.example.payment_test_backend.repository;

import com.example.payment_test_backend.domain.TestEnrolledItem;
import com.example.payment_test_backend.domain.TestOrderedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestEnrolledItemRepository extends JpaRepository<TestEnrolledItem, Long> {

    Optional<TestEnrolledItem> findByTestOrderedItem(TestOrderedItem orderedItem);

    boolean existsByTestOrderedItem(TestOrderedItem orderedItem);

}
