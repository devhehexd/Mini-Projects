import api from '../api/api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });
    
    console.log(response.data);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      return { success: true };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Login failed:', error);
    if (error.response?.data?.message?.includes('Email not verified')) {
      return { 
        success: false, 
        needVerification: true,
        email: email,
        message: '이메일 인증이 필요합니다.' 
      };
    }
    return { 
      success: false, 
      message: error.response?.data?.message || '로그인에 실패했습니다.' 
    };
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/";
};

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const signup = async (email, password, name, phoneNumber) => {
  console.log("signup...");
  console.log(email, password, name, phoneNumber);
  try {
    const response = await api.post('/api/auth/signup', {
      email,
      password,
      name,
      phoneNumber
    });
    
    if (response.data.success) {
      return { success: true };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Signup failed:', error);
    return { success: false, message: error.response?.data?.message || '회원가입에 실패했습니다.' };
  }
};

export const verify = async (email, confirmationCode, name) => {
  try {
    const response = await api.post('/api/auth/verify', {
      email,
      confirmationCode,
      name
    });
    
    if (response.data.success) {
      return { success: true };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Verification failed:', error);
    if (error.response?.data?.code === 'ALREADY_VERIFIED') {
      return { 
        success: false, 
        alreadyVerified: true,
        message: '이미 인증된 계정입니다. 로그인을 진행해주세요.' 
      };
    }
    return { 
      success: false, 
      message: error.response?.data?.message || '인증에 실패했습니다.' 
    };
  }
};