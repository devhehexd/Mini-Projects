package com.example.payment_test_backend.controller;

import com.example.payment_test_backend.domain.TestOrder;
import com.example.payment_test_backend.dto.OrderRequestDto;
import com.example.payment_test_backend.dto.PaymentVerificationDto;
import com.example.payment_test_backend.service.PaymentTestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class PaymentTestController {

    private final PaymentTestService paymentTestService;

//    private final ObjectMapper objectMapper;
//
//    @Value("${portone.api.secret}")
//    private String portOneSecretKey;

    @PostMapping("/payment/order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDto orderRequest) {

        log.info("Order request received: {}", orderRequest);

        try {
            TestOrder order = paymentTestService.createOrder(orderRequest);
            return ResponseEntity.ok(Map.of(
                    "merchantUid", order.getMerchantUid(),
                    "totalAmount", order.getTotalAmount()
            ));
        } catch (Exception e) {
            log.error("Order creation failed", e);
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/payment/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto payload) {

        log.info("Payment verification request received: {}", payload);

        try {
            paymentTestService.verifyPayment(
                    payload.getImpUid(),
                    payload.getMerchantUid()
            );
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "결제 정보가 저장되었습니다."
            ));

        } catch (Exception e) {
            log.error("Payment verification failed", e);
            return ResponseEntity.status(HttpStatus.OK)  // 실패해도 200 반환
                    .body(Map.of(
                            "status", "pending",
                            "message", "결제는 완료되었으나 검증에 실패했습니다. 잠시 후 자동으로 처리됩니다."
                    ));
        }

    }

    @PostMapping("/payment/webhook")
    public ResponseEntity<?> handleWebHook(@RequestBody Map<String, String> webHookData
                                           /*@RequestHeader(value = "X-IamportSignature", required = false) String signature*/) {

        log.info("Webhook received: {}", webHookData);

        try {
//            // verify signature
//            String jsonBody = objectMapper.writeValueAsString(webHookData);
//            log.info("Signature: {}", signature);
//            if (signature == null || !PortOneWebHookVerifier.isValidSignature(jsonBody, signature, portOneSecretKey)) {
//                log.error("Webhook signature is invalid");
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
//                        "message", "Webhook signature is invalid"
//                ));
//            }
            paymentTestService.processWebHook(webHookData);
            return ResponseEntity.ok().body(Map.of(
                    "message", "Webhook processed successfully"
            ));

        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            // 포트원은 2xx 응답을 받아야 재시도하지 않음
            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "message", "Webhook received but processing failed",
                    "error", e.getMessage()
            ));
        }
    }
}
