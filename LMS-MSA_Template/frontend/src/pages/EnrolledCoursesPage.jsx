import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/api';

const EnrolledCoursesPage = ({ enrolledCourses: initialCourses }) => {
  const [enrolledCourses, setEnrolledCourses] = useState(initialCourses);

  const handleDelete = async (courseId) => {
    try {
      // API 요청: 수강 삭제
            
      console.log(courseId)
      await api.delete(`/api/enrollments/${courseId}`);
      
      // 로컬 상태에서 제거
      setEnrolledCourses((prevCourses) => 
        prevCourses.filter((course) => course.id !== courseId)
      );
      alert('강의가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to unenroll:', error);
      alert('강의를 삭제하는 데 실패했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">수강한 강의</h2>
      
      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500">수강 신청한 강의가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <div 
              key={course.id} 
              className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <img 
                src={course.thumbnailUrl || "https://via.placeholder.com/64"} 
                alt={course.title} 
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <button 
                onClick={() => handleDelete(course.id)} 
                className="ml-4 px-3 py-1 text-red-600 border border-red-600 rounded-lg text-sm hover:bg-red-600 hover:text-white transition duration-200"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;
