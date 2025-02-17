package com.sesac.backend.evaluation.exam.dto.request;

import com.sesac.backend.evaluation.enums.Type;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;

/**
 * @author dongjin
 * 기말고사 dto
 * Exam 데이터 전달 객체
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ExamCreationRequest {

    /**
     * finalExamId:     PK
     * course:          기말고사 생성한 강의
     * startTime:       시작시간
     * endTime:         종료시간
     */
    private UUID openingId;
    private List<ExamProblemCreationDto> problems;
    private Type type;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
