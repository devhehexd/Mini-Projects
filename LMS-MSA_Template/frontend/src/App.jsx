import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import CourseListPage from './pages/CourseListPage';
import EnrolledCoursesPage from './pages/EnrolledCoursesPage';
import CreateCoursePage from './pages/CreateCoursePage';
import Callback from './pages/Callback';
import {
  getAccessToken,
  setAccessToken,
  login,
  logout,
} from './cognito/AuthService.js';
import api from './api/api.js';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import CartPage from './pages/CartPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      fetchEnrolledCourses(); // 로그인 상태라면 수강한 강의 목록을 불러옵니다.
    }
  }, [isAuthenticated]);

  // 수강한 강의 목록을 가져오는 함수
  const fetchEnrolledCourses = async () => {
    try {
      console.log("fetchEnrolledCourses...");

      const response = await api.get(`/api/enrollments`);

      console.log(response.data);

      setEnrolledCourses(response.data.map((enrollment) => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        instructor: enrollment.course.instructor,
        thumbnailUrl: enrollment.course.thumbnailUrl,
      }))); // 수강한 강의 목록 업데이트
    } catch (error) {
      console.error('수강한 강의 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      const response = await api.post(`/api/carts`, { courseId });
      alert('장바구니에 담겼습니다!');
      
    } catch (error) {
      console.error('장바구니 담기에 실패했습니다:', error);
      alert('장바구니 담기에 실패했습니다.');
    }
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} login={login} logout={logout} />
      <div className="p-4">
        <Routes>
          {/* 강의 목록 페이지는 모든 사용자에게 공개 */}
          <Route
            path="/courses"
            element={<CourseListPage onEnroll={enrollInCourse} />}
          />

          {/* 수강한 강의 페이지는 인증된 사용자만 접근 가능 */}
          <Route
            path="/enrolled"
            element={
              isAuthenticated ? (
                <EnrolledCoursesPage enrolledCourses={enrolledCourses} />
              ) : (
                <Navigate to="/courses" />
              )
            }
          />

          <Route
            path="/carts"
            element={<CartPage />}
          />

          <Route
            path="/create-course"
            element={<CreateCoursePage />}
          />

          {/* 로그인 후 리디렉트 페이지 */}
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/verify" element={<VerifyPage />} />

          {/* 기본 경로는 강의 목록으로 리디렉트 */}
          <Route path="/" element={<Navigate to="/courses" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
