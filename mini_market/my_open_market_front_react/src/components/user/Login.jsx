import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {

  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ id: '', password: '' });

  const { id, password } = inputs;

  const onChange = (evt) => {
    const { name, value } = evt.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const login = () => {
    axios.post('http://localhost:8081/login', {}, { params: { id: id, password: password } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isAuthenticated) {
            localStorage.setItem('token', res.data.token);
            navigate('/userhome')
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
      <h2>로그인</h2>
      <hr />
      아이디: <input type="text" name="id" value={id} onChange={onChange} /><br />
      비밀번호: <input type="password" name="password" value={password} onChange={onChange} /><br />
      <button onClick={login}>로그인</button><br /><br />
      회원이 아니신가요?
      <Link to="/createaccount"> 회원가입</Link>
    </div>
  )
}