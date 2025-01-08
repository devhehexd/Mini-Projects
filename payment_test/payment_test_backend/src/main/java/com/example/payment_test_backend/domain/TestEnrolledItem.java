package com.example.payment_test_backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TestEnrolledItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrolledItemId;

    private String studentId;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "itemId")
//    private TestItem testItem;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderedItemId")
    private TestOrderedItem testOrderedItem;

    private boolean isActive;

}
