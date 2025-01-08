import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verify } from '../cognito/AuthService';

const VerifyPage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.name) {
      setName(location.state.name);
    }

    if (!location.state?.email) {
      navigate('/login');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('잘못된 접근입니다.');
      return;
    }
  
    const result = await verify(email, code, name);
    if (result.success) {
      alert('이메일 인증이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } else if (result.alreadyVerified) {
      alert(result.message);
      navigate('/login');
    } else {
      setError(result.message || '인증에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">이메일 인증</h2>
        <div className="space-y-2">
          <p className="text-center text-gray-600">
            이메일: {email}
          </p>
          {name && (
            <p className="text-center text-gray-600">
              이름: {name}
            </p>
          )}
          <p className="text-center text-gray-600">
            위 이메일로 전송된 인증 코드를 입력해주세요.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증 코드"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            인증하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;