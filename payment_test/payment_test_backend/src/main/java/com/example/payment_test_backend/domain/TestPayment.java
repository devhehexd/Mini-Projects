package com.example.payment_test_backend.domain;

import com.example.payment_test_backend.constant.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TestPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", unique = true)
    private TestOrder testOrder;

    private String impUid; // 포트원 결제 고유번호

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String method;
    private Integer amount;
    private LocalDateTime paidAt;

    private LocalDateTime refundedAt;
    private Integer refundAmount;

}
