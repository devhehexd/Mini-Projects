package com.example.payment_test_backend.repository;

import com.example.payment_test_backend.domain.TestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestItemRepository extends JpaRepository<TestItem, Long> {

    TestItem findByTitle(String title);
}
