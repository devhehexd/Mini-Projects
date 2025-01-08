import React from 'react';
import { Clock, BookOpen, UserCircle } from 'lucide-react';

const CourseList = () => {
    const courses = [
        {
            title: "AWS 클라우드를 활용한 MSA 기반 개발자 양성과정",
            instructor: "윤지수",
            progress: 50,
            category: "BACKEND",
            level: "중급",
            duration: "8주",
            coverImage: "https://via.placeholder.com/300x200"
        },
        {
            title: "취업을 위한 자료구조, 알고리즘 특강",
            instructor: "윤지수",
            progress: 80,
            category: "CLASS IN CLASS",
            level: "초급",
            duration: "4주",
            coverImage: "https://via.placeholder.com/300x200"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {courses.map((course, index) => (
                <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                    <div className="relative">
                        <img 
                            src={course.coverImage} 
                            alt={course.title} 
                            className="w-full h-48 object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            {course.category}
                        </span>
                    </div>
                    
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                            {course.title}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-3 space-x-3">
                            <div className="flex items-center space-x-1">
                                <UserCircle size={16} className="text-gray-500" />
                                <span>{course.instructor}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <BookOpen size={16} className="text-gray-500" />
                                <span>{course.level}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock size={16} className="text-gray-500" />
                                <span>{course.duration}</span>
                            </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-500">
                                진행률: {course.progress}%
                            </span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                강의 이동
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseList;