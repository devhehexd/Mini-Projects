// useWebSocket.js
import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { enrollmentAPI } from '../../../api/services';

// 커스텀 훅 정의: studentId, courses(객체)와 결과 처리 함수들을 파라미터로 받음
const useWebSocket = (studentId, courses, onEnrollmentResult, onCourseStatusUpdate) => {

    // STOMP 클라이언트 상태 관리
    // null 초기값으로 시작하여 연결 성공 시 클라이언트 객체를 저장
    const [stompClient, setStompClient] = useState(null);

    // 각 강좌별 현재 수강신청 인원을 관리하는 상태
    // 객체 형태로 {강좌ID: 현재인원} 형식으로 저장
    const [currentEnrollments, setCurrentEnrollments] = useState({})

    // useEffect: 웹소켓 연결 설정 및 관리
    // studentId나 courses가 변경될 때마다 실행
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new WebSocket('ws://localhost:8081/ws-enrollment'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: function (str) {
                console.log('STOMP Debug', str);
            },
            onConnect: () => {
                console.log("WebSocket Connected Successfully!");
                setStompClient(client);

                // 수강신청 결과 구독
                client.subscribe(`/user/${studentId}/topic/enrollment-result`, message => {
                    const result = JSON.parse(message.body);
                    console.log("수강신청 결과: ", result);
                    alert(result.message);

                    if (result.success) {
                        Promise.all([
                            enrollmentAPI.getAllCourses(),
                            enrollmentAPI.getStudentEnrollments(studentId)
                        ])
                    }

                });

                // 강의별 상태 업데이트 구독
                if (courses.length > 0) {
                    courses.forEach(course => {
                        client.subscribe(`/topic/course-status/${course.openingId}`, message => {
                            const update = JSON.parse(message.body);
                            console.log("강의 상태 업데이트: ", update);
                            setCurrentEnrollments(prev => ({
                                ...prev,
                                [update.openingId]: update.currentEnrollment
                            }))
                        });
                    });
                }
            },
            onStompError: (frame) => {
                console.error('STOMP Error: ', frame);
            },
            onWebSocketError: (event) => {
                console.error('WebSocket Error: ', event);
            }
        });

        client.activate();

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [studentId, courses]);

    return currentEnrollments;
};

export default useWebSocket;