import React, { useState } from 'react';

const Notices = () => {
    const [activeTab, setActiveTab] = useState("공지사항");

    const notices = [
        { id: 1, title: "센터 휴관일 안내", author: "새싹 관리자", date: "2024/10/03" },
        { id: 2, title: "스터디 공간 안내", author: "새싹 관리자", date: "2024/10/14" }
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mt-8">
            {/* Tab 메뉴 */}
            <div className="flex border-b">
                {["공지사항", "강의 공지사항", "시험 및 과제"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-4 py-2 font-semibold ${
                            activeTab === tab ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 공지사항 목록 */}
            <div className="bg-white shadow-md rounded-lg mt-4">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2 px-4">No.</th>
                            <th className="py-2 px-4">제목</th>
                            <th className="py-2 px-4">작성자</th>
                            <th className="py-2 px-4">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice) => (
                            <tr key={notice.id} className="border-t">
                                <td className="py-2 px-4">{notice.id}</td>
                                <td className="py-2 px-4">{notice.title}</td>
                                <td className="py-2 px-4">{notice.author}</td>
                                <td className="py-2 px-4">{notice.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Notices;
