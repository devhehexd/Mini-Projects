import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Post() {

  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const postToDo = (evt) => {

    evt.preventDefault();

    let formdata = new FormData(document.getElementById('post'));

    axios.post('/api/post', formdata, { headers: { Authorization: `Bearer ${token}` } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isPosted) {
            alert('등록 완료')
            navigate('/')
          }
          else {
            alert('등록 실패')
          }
        }
        else {
          alert('글 작성 취소')
        }
      })
  }


  return (

    <div>
      <h1>To-Do 추가</h1>
      <form id="post" onSubmit={postToDo}>
        To-Do: <input type="text" name="toDo" /><br /><br />
        D-Day: <input type="date" name="dDay" /><br /><br />
        상세 내용: <textarea name="details" /><br /><br />
        <input type="submit" value="등록"></input>
      </form>
    </div>
  )
}