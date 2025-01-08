import './App.css';
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App container d-flex justify-content-center align-items-center vh-100 text-center">
      <div className="row align-items-center mb-3">
        <h3>Open Market</h3>
        <hr />
        <Link to="/login">Open Market 시작</Link>
      </div>
    </div>
  );
}

export default App;
