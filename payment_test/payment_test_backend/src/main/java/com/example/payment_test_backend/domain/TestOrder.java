package com.example.payment_test_backend.domain;

import com.example.payment_test_backend.constant.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"testPayment", "testOrderedItem"})
public class TestOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(unique = true)
    private String merchantUid;

    @Column
    private String studentId;

    @Column
    private Integer totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "testOrder", cascade = CascadeType.ALL)
    private List<TestOrderedItem> testOrderedItems = new ArrayList<>();
}
