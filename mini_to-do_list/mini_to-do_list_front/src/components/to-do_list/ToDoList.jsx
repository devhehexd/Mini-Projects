import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

function ToDoList() {

  const token = localStorage.getItem('token');

  const [toDoList, setToDolist] = useState([]);

  const [userId, setUserId] = useState(null);

  // const dateFormat = (postDate) => {
  //   const date = new Date(postDate);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0')
  //   return `${year}-${month}-${day}`;
  // }

  const dDayCal = (dDay) => {
    const today = new Date();
    const dDate = new Date(dDay);

    const timeDiff = dDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff > 0) {
      return `D-${dayDiff}`
    }
    else if (dayDiff == 0) {
      return `D-Day`;
    }
    else {
      return `D+${Math.abs(dayDiff)}`;
    }
  }

  useEffect(() => {
    if (token) {

      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);

      axios.get('/api', { headers: { Authorization: `Bearer ${token}` } })
        .then(function (res) {
          if (res.status === 200) {
            setToDolist(res.data.toDoList);
          } else {
            alert('비정상 응답');
          }
        });
    }
  }, []);

  const deleteToDo = (number) => {

    axios.delete('/api/' + number, { headers: { Authorization: `Bearer ${token}` } })
      .then(function (res) {
        if (res.status === 200) {
          if (res.data.isDeleted) {
            const editedToDoList = [...toDoList].filter(toDo => toDo.number != number);
            setToDolist(editedToDoList);
            alert('삭제 완료')
          }
          else {
            alert('삭제 실패')
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
        <thead>
          <tr>
            <th>번호</th>
            <th>To-Do</th>
            <th>D-Day</th>
          </tr>
        </thead>
        <tbody>
          {toDoList
            .filter(item => item.writer.id === userId) // 필터링 기준
            .map((item, idx) => (
              <tr key={idx}>
                <td>{item.number}</td>
                <td><Link to={'/details/' + item.number}>{item.toDo}</Link></td>
                <td>{dDayCal(item.dDay)}</td>
                <td><button type="button" onClick={() => deleteToDo(item.number)} >삭제</button></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ToDoList;
