import { Link } from 'react-router-dom';
import ToDoList from './ToDoList';

function MyToDoHome({ setToken }) {

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <div>
      <button onClick={logout}>로그아웃</button><br /><br />
      <Link to="/post">추가</Link>
      <form>
        <ToDoList></ToDoList>
      </form>
    </div>
  );
}

export default MyToDoHome;