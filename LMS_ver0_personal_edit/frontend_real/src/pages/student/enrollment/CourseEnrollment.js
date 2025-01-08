import React, { useCallback, useState } from 'react';
import CourseSearch from './components/CourseSearch';
import CartList from './components/CartList';
import EnrollmentHistory from './components/EnrollmentHistory';
import TimeTablePreview from './components/TimeTablePreview';
import EnrollmentStatus from './components/EnrollmentStatus';
// 2024/11/16 import by gnuke ------------------------------------------------
import useWebSocketTest from './useWebSocketTest'; // kafka 통신을 위한 커스텀 훅 import
import useFetchInitialData from './useFetchInitialData'; // 학생 상태 조회 등을 관리할 훅 import
import useFetchCourses from "./useFetchCourses"; //courses 정보에 변화가 있을 때마다 최신화 돼서 UI에 반영되도록 할 UseEffect 관리 훅 import
import useEnrollmentServiceTest from "./useEnrollmentServiceTest"; // EnrollmentService에 관한 함수들을 관리할 훅 import
import { enrollmentAPI } from '../../../api/services';

const CourseEnrollment = () => {

  const studentId = 'eeeeeeee-1111-1111-1111-111111111111'
  const [currentEnrollments, setCurrentEnrollments] = useState({})
  const [activeTab, setActiveTab] = useState('search');

  const { enrolledCourses, myTimeTable, loading: loadingInitial, error: errorInitial, refreshEnrollments } = useFetchInitialData(studentId);
  const { courses, loading: loadingCourses, error: errorCourses } = useFetchCourses();

  // WebSocket 구독 설정 - 필요한 상태 업데이트 함수들 전달
  useWebSocketTest(
    studentId,
    courses,
    setCurrentEnrollments,
    refreshEnrollments
  );

  const { handleEnrollCourse, handleCancelEnrollment } = useEnrollmentServiceTest();

  // 로딩 및 오류 처리
  if (loadingInitial || loadingCourses) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (errorInitial || errorCourses) {
    return <div className="text-center py-10 text-red-600">{errorInitial || errorCourses}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* 수강신청 현황 */}
      <EnrollmentStatus enrolledCourses={enrolledCourses} />

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('search')}
              className={`${activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              강의 검색
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`${activeTab === 'cart'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              장바구니 ({/*cartItems.length*/})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              신청 내역
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`${activeTab === 'timetable'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              시간표
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {activeTab === 'search' && (
            <CourseSearch
              // onAddToCart={handleAddToCart}
              enrolledCourses={enrolledCourses}
              // cartItems={cartItems}
              courses={courses}
              studentId={studentId}
              currentEnrollments={currentEnrollments}
              onEnrollCourse={handleEnrollCourse}
            />
            // 강의 검색 컴포넌트
          )}
          {activeTab === 'cart' && (
            <CartList
              // cartItems={cartItems}
              // onRemoveFromCart={handleRemoveFromCart}
              onEnrollCourse={handleEnrollCourse}
            />
            // 장바구니 컴포넌트
          )}
          {activeTab === 'history' && (
            <EnrollmentHistory
              courses={courses}
              enrolledCourses={enrolledCourses}
              studentId={studentId}
              currentEnrollments={currentEnrollments}
              onCancelEnrollment={handleCancelEnrollment}
            />
            //신청 내역 컴포넌트

          )}
          {activeTab === 'timetable' && (
            // <TimeTablePreview courses={[...enrolledCourses, ...cartItems]} />
            <TimeTablePreview
              myTimeTable={myTimeTable}
            />
            // 시간표 컴포넌트
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollment;