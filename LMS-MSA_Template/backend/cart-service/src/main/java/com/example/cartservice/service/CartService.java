package com.example.cartservice.service;

import com.example.cartservice.client.CourseServiceClient;
import com.example.cartservice.dto.CartRequest;
import com.example.cartservice.dto.CartResponse;
import com.example.cartservice.dto.CourseResponse;
import com.example.cartservice.entity.Cart;
import com.example.cartservice.exception.DuplicateCourseException;
import com.example.cartservice.repository.CartRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {
    private final CartRepository cartRepository;
    private final CourseServiceClient courseClient;
    private final RedisTemplate<String, Cart> redisTemplate;

    @Transactional
    public CartResponse addToCart(String userId, CartRequest request) {
        // 강의 정보 조회
        CourseResponse course = courseClient.getCourse(request.getCourseId());

        // 이미 담긴 강의인지 확인
        if (cartRepository.findByUserIdAndCourseId(userId, request.getCourseId()).isPresent()) {
            throw new DuplicateCourseException(request.getCourseId());
        }

        Cart cart = Cart.builder()
                .userId(userId)
                .courseId(request.getCourseId())
                .courseName(course.getTitle())
                .instructor(course.getInstructor())
                .price(course.getPrice())

                .build();

        cart = cartRepository.save(cart);
        updateCartCache(userId);

        return CartResponse.from(cart);
    }

    public List<CartResponse> getCartItems(String userId) {
        List<Cart> cartItems = getCartItemsFromCache(userId);
        return cartItems.stream()
                .map(CartResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeCartItem(String userId, Long cartId) {
        cartRepository.deleteByUserIdAndId(userId, cartId);
        updateCartCache(userId);
    }

    @Transactional
    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
        clearCartCache(userId);
    }

    private List<Cart> getCartItemsFromCache(String userId) {
        String cacheKey = "cart:" + userId;
        List<Cart> cachedItems = redisTemplate.opsForList().range(cacheKey, 0, -1);
        if (cachedItems == null || cachedItems.isEmpty()) {
            List<Cart> items = cartRepository.findByUserId(userId);
            updateCartCache(userId, items);
            return items;
        }
        return cachedItems;
    }

    private void updateCartCache(String userId) {
        List<Cart> items = cartRepository.findByUserId(userId);
        updateCartCache(userId, items);
    }

    private void updateCartCache(String userId, List<Cart> items) {
        String cacheKey = "cart:" + userId;
        redisTemplate.delete(cacheKey);
        if (!items.isEmpty()) {
            redisTemplate.opsForList().rightPushAll(cacheKey, items);
            redisTemplate.expire(cacheKey, 1, TimeUnit.HOURS);
        }
    }

    private void clearCartCache(String userId) {
        String cacheKey = "cart:" + userId;
        redisTemplate.delete(cacheKey);
    }
}
