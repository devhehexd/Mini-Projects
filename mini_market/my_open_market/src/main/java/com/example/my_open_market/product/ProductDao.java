package com.example.my_open_market.product;

import com.example.my_open_market.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDao extends JpaRepository<Product, Integer> {

    List<Product> findById(User id);
    List<Product> findByProductNameLike(String productName);
    List<Product> findByProductPriceBetween(int p1, int p2);
}
