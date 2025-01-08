package com.example.payment_test_backend.domain;

import com.example.payment_test_backend.constant.OrderedItemStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "testOrder")
public class TestOrderedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderedItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itemId")
    private TestItem testItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId")
    private TestOrder testOrder;

    private Integer price; // 구매 당시 가격

    @Enumerated(EnumType.STRING)
    private OrderedItemStatus status = OrderedItemStatus.ACTIVE;
}
