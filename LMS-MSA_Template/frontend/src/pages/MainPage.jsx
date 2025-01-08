import React from 'react';
import CourseList from '../components/CourseList';
import Notices from '../components/Notices';

const MainPage = () => {
    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* 수강 중인 강의 */}
            <h2 className="text-2xl font-bold mb-4">현재 수업 중인 강의</h2>
            <CourseList />

            {/* 공지사항 및 탭 */}
            <Notices />
        </div>
    );
};

export default MainPage;
