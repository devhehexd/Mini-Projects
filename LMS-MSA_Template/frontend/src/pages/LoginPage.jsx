import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../cognito/AuthService';
import api from '../api/api';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const result = await login(email, password);
    
  //   if (result.success) {
  //     setIsAuthenticated(true);
  //     navigate('/enrolled');
  //   } else if (result.needVerification) {
  //     alert(result.message);
  //     navigate('/verify', { 
  //       state: { 
  //         email: result.email,
  //         name: '' // 백엔드에서 이름 정보도 함께 전달받으면 추가
  //       } 
  //     });
  //   } else {
  //     alert(result.message);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
            
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/enrolled');
      } else if (result.needVerification) {
        const confirmResend = window.confirm('이메일 인증이 필요합니다. 인증 코드를 재발송하시겠습니까?');
        
        if (confirmResend) {
          try {
            await api.post('/api/auth/resend-verification', { email });
            navigate('/verify', { 
              state: { 
                email: result.email,
                name: '' 
              } 
            });
          } catch (error) {
            alert('인증 코드 재발송에 실패했습니다.');
          }
        }
      } else {
        alert(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">로그인</h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            로그인
          </button>
          <div className="mt-4 text-center">
            <span className="text-gray-600">계정이 없으신가요? </span>
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;