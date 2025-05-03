import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeLoginIn from "../pages/HomeLoginIn";
import MisMazos from "../pages/mazos/MisMazos";
import Analisis from "../pages/Analisis";
import SesionEstudio from "../pages/sesionesEstudio/sesionEstudio";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element= {<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<HomeLoginIn />} />
        <Route path="/mazos" element={<MisMazos />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/sesionesEstudio" element={<SesionEstudio />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
