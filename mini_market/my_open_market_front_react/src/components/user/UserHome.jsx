import { Link, useNavigate } from "react-router-dom";

export default function UserHome() {

  const navigate = useNavigate();
  // let token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div>
      <h3>Open Market</h3>
      <hr />
      <button onClick={logout}>로그아웃 </button> |
      <Link to="/board/post"> 상품 등록</Link> |
      <Link to="/board/list"> 내 상품 목록</Link>
    </div>
  )
}