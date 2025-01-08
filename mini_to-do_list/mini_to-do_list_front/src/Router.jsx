import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import CreateAccount from "./components/user/CreateAccount"
import PostToDoList from "./components/to-do_list/PostToDoList"
import ToDoDetails from "./components/to-do_list/ToDoDetails"


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/post" element={<PostToDoList />} />
        <Route path="/details/:postnum" element={<ToDoDetails />} />
      </Routes>
    </BrowserRouter>
  )
}