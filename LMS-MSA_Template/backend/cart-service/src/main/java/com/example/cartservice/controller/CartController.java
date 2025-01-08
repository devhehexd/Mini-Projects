package com.example.cartservice.controller;

import com.example.cartservice.dto.CartRequest;
import com.example.cartservice.service.CartService;
import com.example.cartservice.dto.CartResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestHeader("X-USER-ID") String userId,
            @Valid @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<CartResponse>> getCartItems(
            @RequestHeader("X-USER-ID") String userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable Long cartId) {
        cartService.removeCartItem(userId, cartId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @RequestHeader("X-USER-ID") String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}