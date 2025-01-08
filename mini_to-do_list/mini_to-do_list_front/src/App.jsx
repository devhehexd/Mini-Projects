import { useState, useEffect } from "react";
import Login from "./components/user/Login";
import MyToDoHome from "./components/to-do_list/MyToDoHome";
import { jwtDecode } from "jwt-decode";

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));

  function isTokenExpired(token) {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenExpired(storedToken)) {
      setToken(null);
      localStorage.removeItem('token');
    }
    else {
      setToken(storedToken);
    }
  }, [token]);

  return (
    <div>
      <h1>To-Do List</h1>
      {token === null ?
        <Login setToken={setToken} /> :
        <MyToDoHome setToken={setToken} />}
    </div>
  )
}

export default App;
