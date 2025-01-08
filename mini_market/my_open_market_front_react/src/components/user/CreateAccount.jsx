import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function CreateAccount() {

  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ id: '', password: '', email: '', type: '' });

  const { id, password, email, type } = inputs;

  const onChange = (evt) => {

    const { name, value } = evt.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const createAccount = () => {

    if (!type) {
      alert("타입을 선택해 주세요.");
      return;
    }

    axios.post('http://localhost:8081/createaccount', {}, { params: { id: id, password: password, email: email, type: type } })
      .then(function (res) {
        if (res.status === 200) {
          alert('회원가입 완료');
        }
        else {
          alert('가입 취소');
        }
        navigate('/login');
      })
  }

  return (
    <div>
      <h2>회원가입</h2>
      아이디: <input type="text" name="id" value={id} onChange={onChange} /><br /><br />
      비밀번호: <input type="password" name="password" value={password} onChange={onChange} /><br /><br />
      이메일: <input type="email" name="email" value={email} onChange={onChange} /><br /><br />
      타입:
      <select name="type" value={type} onChange={onChange}>
        <option value="">--선택--</option>
        <option value="seller">판매자</option>
        <option value="buyer">구매자</option>
      </select><br /><br />
      <button onClick={createAccount}>가입</button>
    </div>
  )
}