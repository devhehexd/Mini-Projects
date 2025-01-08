import axios from 'axios';
import React, { useState } from 'react';
import { enrollmentAPI } from '../../../api/services';

const useEnrollmentServiceTest = (initialEnrolledCourses) => {

  // 수강 신청 처리 함수
  const handleEnrollCourse = async (studenttId, course) => {

    try {

      // 수강 신청 요청을 데이터베이스에 저장
      await enrollmentAPI.enrollCourse(studenttId, course);

      console.log(`수강신청 요청 전송 완료: ${course.courseName}`);

    } catch (error) {
      console.error('수강신청 처리 중 오류:', error);
    }
  };

  const handleCancelEnrollment = async (enrollmentId, refreshEnrollments) => {
    try {
      await enrollmentAPI.cancelEnrollment(enrollmentId);
      refreshEnrollments();
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
    }
  }

  return {
    handleEnrollCourse,
    handleCancelEnrollment,
  };
};

export default useEnrollmentServiceTest;