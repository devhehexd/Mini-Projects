package com.example.payment_test_backend.repository;

import com.example.payment_test_backend.domain.TestOrder;
import com.example.payment_test_backend.domain.TestPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTestRepository extends JpaRepository<TestPayment, Integer> {

    Optional<TestPayment> findByImpUid(String impUid);
    Optional<TestPayment> findByTestOrder(TestOrder order);

}
