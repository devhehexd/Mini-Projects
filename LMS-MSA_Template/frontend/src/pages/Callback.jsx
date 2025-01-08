import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../cognito/AuthService';

const Callback = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");

    console.log(accessToken)
    if (accessToken) {
      setAccessToken(accessToken); // 토큰을 로컬 스토리지에 저장
      setIsAuthenticated(true);
      navigate("/enrolled"); // 로그인 후 수강한 강의 페이지로 리디렉트
    } else {
      navigate("/courses");
    }
  }, [navigate, setIsAuthenticated]);

  return <div>로그인 중...</div>;
};

export default Callback;
