import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeLoginIn from "../pages/HomeLoginIn";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element= {<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomeLoginIn />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
