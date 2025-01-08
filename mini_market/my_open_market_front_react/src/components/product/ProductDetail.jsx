import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { postnum } = useParams(); //글 번호
  const [productDto, setProductDto] = useState({ productNumber: 0, id: {}, productPostDate: '', productName: '', productDescription: '', productPrice: 0, productQuantity: 0, img: '' });

  const { productNumber, id, productPostDate, productName, productDescription, productPrice, productQuantity, img } = productDto;

  const onChange = (evt) => {

    const { name, value } = evt.target;
    setProductDto({
      ...productDto,
      [name]: value
    })

  }

  const updateProduct = (evt) => {

    evt.preventDefault();

    axios.put("http://localhost:8081/board/productdetail/" + postnum, productDto, { headers: { token: token } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isDetailChanged) {
            alert('수정 완료')
          }
          else {
            alert('수정 실패')
          }
        }
        else {
          alert('비정상 응답')
        }
        navigate('/board/list')
      })
  }

  const del = () => {
    axios.delete('http://localhost:8081/board/productdetail/' + postnum)
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isDeleted) {
            alert('삭제 완료')
            navigate('/board/list')
          }
          else {
            alert('삭제 취소')
          }
        }
        else {
          alert('비정상 응답')
        }
      })
  }

  let menu = '';

  useEffect(() => {
    axios.get('http://localhost:8081/board/productdetail/' + postnum)
      .then(function (res) {
        if (res.status === 200) {
          setProductDto(res.data.productDto)
        }
        else {
          alert('비정상 응답')
        }
      });
  }, [])

  if (token == id.id) {
    menu = <button onClick={del}>삭제</button>
  }

  return (
    <div>
      <h3>Open Market</h3>
      <hr />
      <h2>상품 상세</h2>
      <form onSubmit={updateProduct}>
        <img src={"http://localhost:8081/read_img/" + img} /><br />
        번호: {productNumber} <br /><br />
        등록일: {productPostDate} <br /><br />
        상품명: <input type="text" name="productName" value={productName} onChange={onChange} /><br /><br />
        가격: <input type="text" name="productPrice" value={productPrice} onChange={onChange} /><br /><br />
        수량: <input type="text" name="productQuantity" value={productQuantity} onChange={onChange} /><br /><br />
        내용: <textarea name="productDescription" value={productDescription} onChange={onChange} /><br /><br />
        <input type="submit" value="수정"></input>
        <input type="button" value="삭제"></input>
      </form>
    </div >
  )
}