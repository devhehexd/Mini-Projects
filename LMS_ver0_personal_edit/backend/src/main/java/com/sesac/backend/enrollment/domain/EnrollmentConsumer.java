package com.sesac.backend.enrollment.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sesac.backend.enrollment.domain.exceptionControl.TimeOverlapException;
import com.sesac.backend.enrollment.dto.EnrollmentDto;
import com.sesac.backend.enrollment.dto.EnrollmentMessageDto;
import com.sesac.backend.enrollment.dto.EnrollmentUpdateMessageDto;
import com.sesac.backend.enrollment.service.EnrollmentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EnrollmentConsumer {

    private final ObjectMapper objectMapper;
    private final EnrollmentService enrollmentService;
    private final SimpMessagingTemplate messagingTemplate;

//    @PostConstruct
//    public void init() {
//        log.info("EnrollmentConsumer initialized");
//    }

    @KafkaListener(
            topics = "enrollment-requests",
            groupId = "enrollment-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
//    public void consumeEnrollmentRequest(List<String> messages, Acknowledgment ack) {
//        try {
//            log.info("Consumer started listening");
//            log.info("Received {} messages", messages.size());
//
//            for (String message : messages) {
//                if (message == null) {
//                    log.warn("Null message received, skipping...");
//                    continue;
//                }
//
//                try {
//                    EnrollmentMessageDto enrollmentMessageDto =
//                            objectMapper.readValue(message, EnrollmentMessageDto.class);
//
//                    enrollmentService.processEnrollment(
//                            enrollmentMessageDto.getStudentId(),
//                            enrollmentMessageDto.getOpeningId()
//                    );
//
//                    log.info("Successfully processed message: {}", message);
//                } catch (JsonProcessingException e) {
//                    log.error("Failed to process message: {}", message, e);
//                }
//            }
//            ack.acknowledge();
//
//        } catch (Exception e) {
//            log.error("Error in consumer: ", e);
//            throw e;
//        }
//    }
    public void consumeEnrollmentRequest(EnrollmentMessageDto message /*String message*/) {
        try {
            // EnrollmentMessageDto enrollmentMessageDto = objectMapper.readValue(message, EnrollmentMessageDto.class);

//            // 수강신청 처리 로직
//            enrollmentService.processEnrollment(
//                    enrollmentMessageDto.getStudentId(),
//                    enrollmentMessageDto.getOpeningId()
//            );

            enrollmentService.processEnrollment(
                    message.getStudentId(),
                    message.getOpeningId()
            );

        } catch (Exception e) {
            log.error("메시지 처리 실패", e);
        }
    }

    @KafkaListener(
            topics = "enrollment-updates",
            groupId = "enrollment-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeEnrollmentUpdate(EnrollmentUpdateMessageDto message) {
        try {
//            EnrollmentUpdateMessageDto updateDto = objectMapper.readValue(message, EnrollmentUpdateMessageDto.class);

            messagingTemplate.convertAndSend(
                    "/topic/enrollment-updates/" + message.getOpeningId(), message);

            log.info("수강인원 업데이트 전송: openingId={}, currentEnrollment={}",
                    message.getOpeningId(), message.getCurrentEnrollment());
        } catch (Exception e) {
            log.error(" 수강인원 업데이트 처리 중 오류 발생", e);
        }
    }

}