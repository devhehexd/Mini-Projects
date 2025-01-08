import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

function Login({ setToken }) {

  const [inputs, setInputs] = useState({ id: '', password: '' });

  const { id, password } = inputs;

  const onChange = (evt) => {
    const { name, value } = evt.target;
    setInputs({ ...inputs, [name]: value });
  }

  const login = () => {
    axios.post('/api/', {}, { params: { id: id, password: password } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isAuthenticated) {
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token)
          }
          else {
            alert('로그인 실패')
          }
        }
        else {
          alert('비정상 응답')
        }
      })
  }


  return (
    <div>
      <table border="1">
        <tbody>
          <tr>
            <td>ID</td>
            <td><input type="text" name="id" value={id} onChange={onChange} /></td>
          </tr>
          <tr>
            <td>Password</td>
            <td><input type="password" name="password" value={password} onChange={onChange} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={login}>로그인</button>
      회원이 아니신가요?
      <Link to="/createaccount"> 회원가입</Link>
    </div>
  );
}

export default Login;