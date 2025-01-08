import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

// 커스텀 훅 정의
// studentId: 학생 식별자
// setCurrentEnrollments: 현재 수강신청 인원 상태 업데이트 함수
// refreshEnrollments: 수강신청 목록 새로고침 함수
const useWebSocketTest = (studentId, courses, setCurrentEnrollments, refreshEnrollments) => {

  // useRef를 사용하여 웹소켓 클라이언트 인스턴스 참조 저장
  // 컴포넌트 리렌더링과 관계없이 값을 유지
  const clientRef = useRef(null)

  // 웹소켓 연결 상태를 추적하는 ref
  // useRef를 사용하여 연결 상태를 저장하고 리렌더링과 무관하게 값 유지
  const isConnectedRef = useRef(false);

  const subscriptionRef = useRef(new Map());

  // useEffect: 웹소켓 연결 설정 및 관리
  useEffect(() => {

    // 이미 연결된 클라이언트가 있을 경우 중복 연결 방지
    if (isConnectedRef.current) {
      return;
    }

    console.log("WebSocket 연결 시도 중...");

    // STOMP 클라이언트 설정
    const client = new Client({
      // 웹소켓 연결 설정 (ws://localhost:8081/ws-enrollment(백엔드에서 설정) 엔드포인트로 연결)
      webSocketFactory: () => new WebSocket('ws://localhost:8081/ws-enrollment'),
      // 연결 끊김 시 5초 후 재연결 시도
      reconnectDelay: 5000,
      // 서버에서 오는 메시지 수신 시 4초 간격으로 연결 상태 확인
      heartbeatIncoming: 4000,
      // 서버로 보내는 메시지 전송 시 4초 간격으로 연결 상태 확인
      heartbeatOutgoing: 4000,
      // 디버깅 메시지 출력
      debug: function (str) {
        console.log('STOMP Debug', str);
      },
      // 연결 성공 시 실행되는 콜백
      onConnect: () => {
        console.log("WebSocket Connected Successfully!");
        isConnectedRef.current = true

        // 1. 개인별 수강신청 결과 구독 *구독이란?: 웹소켓에서 구독은 "특정 주제(topic)에 대한 메시지를 받겠다"고 서버에 등록하는 것
        // /user/${studentId}/topic/enrollment-result: 특정 학생만을 위한 private 채널
        // 여기서는 특정 학생이란 로그인한 학생을 의미
        client.subscribe(`/user/${studentId}/topic/enrollment-result`, message => {
          // 백으로 부터 수신한 메시지를 JSON 형식의 문자열을 자바스크립트 객체로 파싱
          const result = JSON.parse(message.body);
          console.log("수강신청 결과: ", result);
          // 결과 메시지를 알림으로 표시
          alert(result.message)

          // 수강신청 성공 시 목록 새로고침
          if (result.success) {
            // useFetchInitialData 훅에서 정의한 refreshEnrollments 함수 호출
            // refreshEnrollments(): 학생의 수강신청 목록을 조회하는 함수
            refreshEnrollments();
          }

        });

        // 2. 각 강좌별 상태 변경 구독 설정
        setupCourseSubscriptions(client, courses);
      },

      // STOMP 프로토콜 레벨의 에러 처리
      onStompError: (frame) => {
        console.error('STOMP Error: ', frame);
        isConnectedRef.current = false;
      },

      // 웹소켓 연결 자체의 에러 처리
      onWebSocketError: (event) => {
        console.error('WebSocket Error: ', event);
        isConnectedRef.current = false;
      },

      // 연결 해제 시 처리
      onDisconnect: () => {
        console.log('WebSocket 연결 해제');
        isConnectedRef.current = false;
      }
    });

    // 클라이언트 참조 저장
    clientRef.current = client; // 참조에 클라이언트 저장
    // 웹소켓 연결 시작
    client.activate();

    // cleanup 함수: 컴포넌트 언마운트 시 실행
    return () => {
      cleanUpSubscriptions();
      if (client.active) {
        client.deactivate(); // 웹소켓 연결 종료
        isConnectedRef.current = false;
      }
    };

  }, []);

  // courses가 변경될 때마다 구독 갱신
  useEffect(() => {
    if (clientRef.current && isConnectedRef.current && courses) {
      setupCourseSubscriptions(clientRef.current, courses);
    }
  }, [courses]); //courses가 변경될 때마다 실행

  // 강좌별 구독 설정 함수
  const setupCourseSubscriptions = (client, courses) => {

    // 기존 구독 정리
    cleanUpSubscriptions();

    //새로운 구독 설정
    courses.forEach(course => {
      // 2.전체 강좌 상태 변경 구독
      // /topic/course-status: 모든 사용자가 구독하는 public 채널
      const subscription = client.subscribe(`/topic/course-status/${course.openingId}`, message => {
        // 백으로 부터 수신한 메시지를 JSON 형식의 문자열을 자바스크립트 객체로 파싱
        const update = JSON.parse(message.body);
        console.log("강의 상태 업데이트: ", update);
        // 강좌별 현재 수강인원 상태 업데이트
        setCurrentEnrollments(prev => ({
          ...prev, // 이전 상태 복사
          [update.openingId]: update.currentEnrollment // 새로운 값으로 업데이트
        }))
      });

      // 구독 객체 저장
      subscriptionRef.current.set(course.openingId, subscription);
    });
  };

  // 구독 정리 함수
  const cleanUpSubscriptions = () => {

    subscriptionRef.current.forEach((subscription) => {
      subscription.unsubscribe();
    });
    subscriptionRef.current.clear();
  };
  return {};
};

export default useWebSocketTest;