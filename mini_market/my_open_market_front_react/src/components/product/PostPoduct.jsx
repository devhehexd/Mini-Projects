import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PostProduct() {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const postProduct = () => {

    let formData = new FormData(document.getElementById('postform'));

    axios.post('http://localhost:8081/board/post', formData, { headers: { "Content-type": "multipart/form-data", token: token } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isImgUploaded) {
            alert('상품 등록 완료')
          }
          else {
            alert('상품 등록 실패')
          }
        }
        else {
          alert('글 작성 취소')
        }
        navigate('/userhome/')
      });
  }

  return (
    <div>
      <h2>상품 등록</h2>
      <form id="postform">
        상품명: <input type="text" name="productName" /><br />
        가격: <input type="number" name="productPrice" /><br />
        수량: <input type="number" name="productQuantity" /><br />
        이미지 첨부: <input type="file" name="multipartFile" /><br />
        상품 설명: <textarea name="productDescription"></textarea><br />
      </form>
      <button type="button" onClick={postProduct}>등록</button>
    </div>
  )
}