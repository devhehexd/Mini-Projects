package com.example.my_open_market.product;

import com.example.my_open_market.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductDto {

    private int productNumber;
    private String productName;
    private String productDescription;
    private Date productPostDate;
    private int productPrice;
    private int productQuantity;
    private String img;
    private User id;
    private MultipartFile multipartFile;
}
