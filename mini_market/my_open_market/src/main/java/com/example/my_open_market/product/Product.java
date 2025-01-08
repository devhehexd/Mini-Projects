package com.example.my_open_market.product;

import com.example.my_open_market.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productNumber;

    private String productName;
    private String productDescription;
    private Date productPostDate;
    private int productPrice;
    private int productQuantity;
    private String img;

    @ManyToOne
    @JoinColumn(nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User id;

    @PrePersist
    public void productPostDate() {
        productPostDate = new Date();
    }
}
