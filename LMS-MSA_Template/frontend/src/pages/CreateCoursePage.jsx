import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/api';

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('초급');
  const [price, setPrice] = useState('');

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) {
      alert('썸네일 파일을 선택해 주세요.');
      return;
    }
  
    try {
      const response = await api.post(`/api/courses/generate-presigned-url?filename=${encodeURIComponent(thumbnail.name)}`);
  
      if (!response.data || !response.data.uploadUrl) {
        throw new Error('업로드 URL을 받아오지 못했습니다.');
      }
  
      const { uploadUrl } = response.data;
  
      await axios.put(uploadUrl, thumbnail, {
        headers: {
          'Content-Type': thumbnail.type,
        },
      });
  
      const thumbnailUrl = uploadUrl?.split('?')[0];
      if (!thumbnailUrl) {
        throw new Error('썸네일 URL을 생성하지 못했습니다.');
      }
      
      await api.post('/api/courses', {
        title,
        description,
        instructor,
        thumbnailUrl,
        duration,
        level,
        price: Number(price),
      });
  
      alert('강의가 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('강의 생성 실패:', error);
      alert(error.message || '강의 생성에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">강의 생성</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">강의 제목</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="강의 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">강의 설명</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="강의 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">강사 이름</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="강사 이름"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">수강 기간</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 8주"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">가격</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="가격을 입력하세요"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">썸네일 업로드</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md focus:outline-none"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          강의 생성
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;