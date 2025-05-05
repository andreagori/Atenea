import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeLoginIn from "../pages/HomeLoginIn";
import MisMazos from "../pages/decks/MyDecks";
import Analisis from "../pages/Analysis";
import SesionEstudio from "../pages/studySessions/studySession";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicioSesion" element= {<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio" element={<HomeLoginIn />} />
        <Route path="/mazos" element={<MisMazos />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/sesionesEstudio" element={<SesionEstudio />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
