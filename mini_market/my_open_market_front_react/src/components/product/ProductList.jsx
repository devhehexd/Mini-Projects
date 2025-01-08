import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {

  const token = localStorage.getItem('token');

  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/board/list', { headers: { token: token } })
      .then(function (res) {
        if (res.status === 200) {
          setList(res.data.list)
        }
        else {
          alert('비정상 응답')
        }
      })
  }, []);

  return (
    <div>
      <h3>Open Market</h3>
      <hr />
      <h2>내 상품 목록</h2>
      <table border='1'>
        <thead>
          <tr>
            <th>번호</th><th>상품명</th><th>이미지</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, idx) => (
            <tr key={idx}>
              <td>{item.productNumber}</td>
              <td><Link to={"/board/productdetail/" + item.productNumber}>{item.productName}</Link></td>
              <td><img className="simg" src={'http://localhost:8081/read_img/' + item.img} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}