import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";

export default function ToDoDetails() {

  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const { postnum } = useParams();

  const [toDoDetails, setToDoDetails] = useState({ number: 0, toDo: '', details: '', postDate: '', dDay: '' })

  const { number, toDo, details, postDate, dDay } = toDoDetails;

  const dateFormat = (postDate) => {
    const date = new Date(postDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`;
  }

  const onChange = (evt) => {

    const { name, value } = evt.target;
    setToDoDetails({
      ...toDoDetails,
      [name]: value
    })

  }

  useEffect(() => {

    axios.get('/api/details/' + postnum)
      .then(function (res) {
        if (res.status === 200) {
          console.log(res.data.toDoDetails);
          setToDoDetails(res.data.toDoDetails);
        }
        else {
          alert('비정상 응답')
        }
      })
  }, [])

  const edit = (evt) => {

    evt.preventDefault();

    axios.put('/api/details/' + postnum, toDoDetails, { headers: { Authorization: `Bearer ${token}` } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isUpdated) {
            alert('수정 완료')
            navigate('/')
          }
          else {
            alert('수정 실패')
          }
        }
        else {
          alert('비정상 응답')
        }
      })
  }

  return (

    <div>
      <h1>상세 내용</h1>
      <form onSubmit={edit}>
        <table border="1">
          <tbody>
            <tr>
              <td>번호</td>
              <td><input type="text" name="number" value={number} readOnly /></td>
            </tr>
            <tr>
              <td>To-Do</td>
              <td><input type="text" name="toDo" value={toDo} onChange={onChange} /></td>
            </tr>
            <tr>
              <td>등록일</td>
              <td><input type="date" name="postDate" value={dateFormat(postDate)} readOnly /></td>
            </tr>
            <tr>
              <td>D-Day</td>
              <td><input type="date" name="dDay" value={dDay} onChange={onChange} /></td>
            </tr>
            <tr>
              <td>상세 내용</td>
              <td><textarea name="details" value={details} onChange={onChange} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="수정" />
      </form>
    </div>
  )
}