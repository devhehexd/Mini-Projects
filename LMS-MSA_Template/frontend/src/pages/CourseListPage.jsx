import React, { useEffect, useState } from 'react';
import { BookOpen, UserCircle, Clock } from 'lucide-react';
import api from '../api/api';

const CourseListPage = ({ onEnroll }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">전체 강의</h2>

      {/* Filtering Options */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500">
            <option>최신순</option>
            <option>인기순</option>
            <option>할인순</option>
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500">
            <option>전체 분야</option>
            <option>개발</option>
            <option>데이터</option>
            <option>디자인</option>
          </select>
        </div>
        <div className="text-gray-500 text-sm">
          총 {courses.length}개의 강의
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img 
                src={course.thumbnailUrl || "https://via.placeholder.com/300x200"} 
                alt={course.title} 
                className="w-full h-36 md:h-40 object-cover"
              />
              <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg shadow">
                {course.category || "개발"}
              </span>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <div className="flex items-center text-gray-600 text-xs mb-3 space-x-2">
                <div className="flex items-center space-x-1">
                  <UserCircle size={14} className="text-gray-500" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen size={14} className="text-gray-500" />
                  <span>{course.level || "중급"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-gray-500" />
                  <span>{course.duration || "8주"}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {course.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-blue-600 font-semibold">
                  {course.price ? `₩${course.price.toLocaleString()}` : "무료"}
                </div>
                <button
                  onClick={() => onEnroll(course.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-xs"
                >
                  장바구니 추가
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {courses.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100">
            이전
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm">
            1
          </button>
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100">
            2
          </button>
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100">
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
