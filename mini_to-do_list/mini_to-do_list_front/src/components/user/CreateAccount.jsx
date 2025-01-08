import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function CreateAccount() {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ id: '', password: '', email: '' });

  const { id, password, email } = userInfo;

  const onChange = (evt) => {
    const { name, value } = evt.target;
    setUserInfo({ ...userInfo, [name]: value });
  }

  const createAccount = () => {

    if (!id || !password || !email) {
      // ""(빈 문자열)은 JS에서 falsy 값. 즉 아무것도 입력하지 않으면 if(true)가 되므로 if문 실행
      alert('필수 입력 사항을 누락하셨습니다.')
      return;
    }

    axios.post('/api/createaccount', {}, { params: { id: id, password: password, email: email } })
      .then(function (res) {
        if (res.status === 200) {
          alert('회원가입이 완료되었습니다');
        }
        else {
          alert('가입 취소');
        }
        navigate('/');
      })
  }


  return (
    <div>
      <h1>회원가입</h1>
      <table border="1">
        <tbody>
          <tr>
            <td>ID</td>
            <td><input type="text" name="id" value={id} onChange={onChange} required /></td>
          </tr>
          <tr>
            <td>Password</td>
            <td><input type="password" name="password" value={password} onChange={onChange} required /></td>
          </tr>
          <tr>
            <td>Email</td>
            <td><input type="email" name="email" value={email} onChange={onChange} required /></td>
          </tr>
          <tr>
          </tr>
        </tbody>
      </table>
      <button onClick={createAccount}>회원가입</button>
    </div>
  );
}

export default CreateAccount;