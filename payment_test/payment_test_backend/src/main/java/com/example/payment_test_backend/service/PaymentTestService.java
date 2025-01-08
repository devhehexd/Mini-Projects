package com.example.payment_test_backend.service;

import com.example.payment_test_backend.constant.OrderStatus;
import com.example.payment_test_backend.constant.PaymentStatus;
import com.example.payment_test_backend.domain.*;
import com.example.payment_test_backend.dto.*;
import com.example.payment_test_backend.repository.PaymentTestRepository;
import com.example.payment_test_backend.repository.TestEnrolledItemRepository;
import com.example.payment_test_backend.repository.TestItemRepository;
import com.example.payment_test_backend.repository.TestOrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentTestService {

    private final TestItemRepository testItemRepository;
    private final PaymentTestRepository paymentTestRepository;
    private final TestOrderRepository testOrderRepository;
    private final TestEnrolledItemRepository testEnrolledItemRepository;
    private final RestTemplate restTemplate;

    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;

    @Transactional
    public TestOrder createOrder(OrderRequestDto orderRequest) {
        // 주문 생성
        TestOrder order = new TestOrder();
        order.setMerchantUid("ORD-" + System.currentTimeMillis());
        order.setStudentId(orderRequest.getStudentId());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setOrderStatus(OrderStatus.PENDING);

        // 주문 상품 추가
        for (OrderItemDto itemDto : orderRequest.getItems()) {
            TestItem item = testItemRepository.findById(itemDto.getItemId())
                    .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

            TestOrderedItem orderedItem = new TestOrderedItem();
            orderedItem.setTestItem(item);
            orderedItem.setTestOrder(order);
            orderedItem.setPrice(item.getPrice());
            order.getTestOrderedItems().add(orderedItem);
        }

        return testOrderRepository.save(order);
    }

    @Transactional
    public void verifyPayment(String impUid, String merchantUid) {

        System.out.println("impUid: " + impUid);
        System.out.println("merchantUid: " + merchantUid);

        try {
            // 주문 조회
            TestOrder order = testOrderRepository.findByMerchantUid(merchantUid)
                    .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));

            // 이미 결제 정보가 있는지 확인
            Optional<TestPayment> existingPayment = paymentTestRepository.findByTestOrder(order);
            if (existingPayment.isPresent()) {
                log.info("Payment already exists: {}", merchantUid);
                return;
            }

            // 포트원 API로 결제 정보 조회
            String token = getPortOneAccessToken();
            PaymentResponseDto portOnePayment = getPaymentInfo(impUid, token);

            log.info("Order: {}", order);
            log.info("PortOne Payment: {}", portOnePayment);

            // 결제 정보 저장 (verify 성공 여부와 관계 없이)
            TestPayment payment = new TestPayment();
            payment.setTestOrder(order);
            payment.setImpUid(impUid);
            payment.setAmount(order.getTotalAmount());

            // verify 실패 시 READY 상태로 저장
            if (portOnePayment == null || portOnePayment.getResponse() == null) {
                payment.setPaymentStatus(PaymentStatus.READY);
                paymentTestRepository.save(payment);
                log.warn("Payment verification failed, waiting for webhook");
                return;
            }

            // 검증 로직
            PortOnePaymentDto portOneResponse = portOnePayment.getResponse();

            // 1. 결제 금액 검증
            if (!order.getTotalAmount().equals(portOneResponse.getAmount())) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentTestRepository.save(payment);
                throw new RuntimeException("결제 금액이 일치하지 않습니다. 주문금액: " +
                        order.getTotalAmount() + ", 실제결제금액: " + portOneResponse.getAmount());
            }

            // 2. 결제 상태 검증
            if (!"paid".equals(portOneResponse.getStatus())) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentTestRepository.save(payment);
                throw new RuntimeException("결제가 완료되지 않았습니다. 상태: " + portOneResponse.getStatus());
            }

            // 3. 위변조 검증 (merchant_uid가 해당 주문의 것이 맞는지)
            if (!merchantUid.equals(portOneResponse.getMerchantUid())) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentTestRepository.save(payment);
                throw new RuntimeException("주문정보가 위변조되었습니다.");
            }

            // 모든 검증 통과 시 결제 정보 업데이트
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setMethod(portOneResponse.getPayMethod());
            payment.setPaidAt(LocalDateTime.now());
            paymentTestRepository.save(payment);

            // 주문 상태 업데이트
            order.setOrderStatus(OrderStatus.PAID);
            createEnrolledItems(order);

        } catch (DataIntegrityViolationException e) { // DB 제약조건 위반 시
            log.warn("Concurrent payment creation detected for order: {}", merchantUid);
            // 이미 다른 트랜잭션에서 결제가 생성됨
            return;
        } catch (Exception e) {
            log.error("Payment verification failed", e);

//            // 에러 발생시에도 READY 상태로 결제 정보 저장
//            TestOrder order = testOrderRepository.findByMerchantUid(merchantUid)
//                    .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));
//
//            TestPayment payment = new TestPayment();
//            payment.setTestOrder(order);
//            payment.setImpUid(impUid);
//            payment.setAmount(order.getTotalAmount());
//            payment.setPaymentStatus(PaymentStatus.READY);
//
//            paymentTestRepository.save(payment);

            throw e;
        }
    }

    @Transactional
    public void processWebHook(Map<String, String> webHookData) {

        String impUid = webHookData.get("imp_uid");
        String merchantUid = webHookData.get("merchant_uid");
        String status = webHookData.get("status");

        log.info("Webhook received - impUid: {}, merchantUid: {}, status: {}",
                impUid, merchantUid, status);

        try {
            TestPayment payment = paymentTestRepository.findByImpUid(impUid)
                    .orElseGet(() -> {
                        TestOrder order = testOrderRepository.findByMerchantUid(merchantUid)
                                .orElseThrow(() -> new RuntimeException("주문 정보를 찾을 수 없습니다"));

                        TestPayment newPayment = new TestPayment();
                        newPayment.setTestOrder(order);
                        newPayment.setImpUid(impUid);
                        newPayment.setAmount(order.getTotalAmount());
                        newPayment.setPaymentStatus(PaymentStatus.READY);

                        return paymentTestRepository.save(newPayment);
                    });

            // 이미 처리된 상태면 중복 처리 방지
            if (payment.getPaymentStatus() == PaymentStatus.PAID && "paid".equals(status)) {
                log.info("Payment already processed: {}", payment);
                return;
            }

            switch (status) {
                case "paid" -> handlePaymentSuccess(payment);
                case "cancelled" -> handlePaymentCancellation(payment);
                case "failed" -> handlePaymentFailure(payment);
                default -> log.warn("Unknown payment status: {}", status);
            }

            paymentTestRepository.save(payment);

        } catch (Exception e) {
            log.error("Webhook processing failed for payment: " + impUid, e);
            throw new RuntimeException("Webhook processing failed", e);
        }
    }

    private void createEnrolledItems(TestOrder order) {
        for (TestOrderedItem orderedItem : order.getTestOrderedItems()) {
            // 이미 등록된 수강 정보가 있는지 확인
            if (testEnrolledItemRepository.existsByTestOrderedItem(orderedItem)) {
                continue;
            }

            TestEnrolledItem enrolledItem = new TestEnrolledItem();
            enrolledItem.setStudentId(order.getStudentId());
            // enrolledItem.setTestItem(orderedItem.getTestItem());
            enrolledItem.setTestOrderedItem(orderedItem);
            enrolledItem.setActive(true);
            testEnrolledItemRepository.save(enrolledItem);
        }
    }

    private String getPortOneAccessToken() {

        System.out.println("API Key: " + apiKey);
        System.out.println("API Secret: " + apiSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("imp_key", apiKey);
        requestMap.put("imp_secret", apiSecret);

        try {
            String requestBody = objectMapper.writeValueAsString(requestMap);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.iamport.kr/users/getToken",
                    new HttpEntity<>(requestBody, headers),
                    Map.class
            );

            log.info("Response: {}", response.getBody());

            return ((Map<String, String>) response.getBody().get("response")).get("access_token");

        } catch (Exception e) {
            log.error("Failed to get access token", e);
            throw new RuntimeException("Failed to get PortOne access token: " + e.getMessage());
        }
    }

    private PaymentResponseDto getPaymentInfo(String impUid, String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<PaymentResponseDto> response = restTemplate.exchange(
                "https://api.iamport.kr/payments/" + impUid,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                PaymentResponseDto.class
        );

        System.out.println("Payment Info: " + response.getBody());

        // 실제 API 응답 확인을 위한 로그 추가
        log.info("API Response Status: {}", response.getStatusCode());
        log.info("API Response Headers: {}", response.getHeaders());
        log.info("API Response Body: {}", response.getBody());

        return response.getBody();
    }

    private void handlePaymentSuccess(TestPayment payment) {
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
    }

    private void handlePaymentCancellation(TestPayment payment) {
        payment.setPaymentStatus(PaymentStatus.CANCELLED);
        payment.setRefundedAt(LocalDateTime.now());

        TestOrder order = payment.getTestOrder();
        order.setOrderStatus(OrderStatus.CANCELLED);

        // 수강 정보 비활성화
        for (TestOrderedItem orderedItem : order.getTestOrderedItems()) {
            TestEnrolledItem enrolledItem = testEnrolledItemRepository.findByTestOrderedItem(orderedItem)
                    .orElseThrow(() -> new RuntimeException("수강 정보를 찾을 수 없습니다"));
            enrolledItem.setActive(false);
        }
    }

    private void handlePaymentFailure(TestPayment payment) {
        payment.setPaymentStatus(PaymentStatus.FAILED);
    }

}
