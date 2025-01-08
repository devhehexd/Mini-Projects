import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../cognito/AuthService';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!emailRegex.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }
    if (password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      newErrors.phone = '유효한 전화번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const result = await signup(email, password, name, phone);
    if (result.success) {
      alert('회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.');
      navigate('/verify', { state: { email, name } });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">회원가입</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호 (숫자만 입력)"
              className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;