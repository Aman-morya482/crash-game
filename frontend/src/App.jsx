import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AppLayout from "./Components/AppLayout"
import Profile from "./pages/Profile"
import Game from "./Pages/Game"
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Route>

            <Route path="game" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  )
}

export default App