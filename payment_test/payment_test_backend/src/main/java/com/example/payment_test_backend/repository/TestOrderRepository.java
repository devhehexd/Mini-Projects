package com.example.payment_test_backend.repository;

import com.example.payment_test_backend.domain.TestOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestOrderRepository extends JpaRepository<TestOrder, Long> {

    Optional<TestOrder> findByMerchantUid(String merchantUid);
}
