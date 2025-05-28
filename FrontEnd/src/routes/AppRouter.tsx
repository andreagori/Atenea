import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeLoginIn from "../pages/HomeLoginIn";
import MisMazos from "../pages/decks/MyDecks";
import OneDeck from "../pages/decks/OneDeck";
import Analisis from "../pages/Analysis";
import StudySession from '../pages/studySessions/StudySession';
import RegularStudySession from "../pages/studySessions/RegularStudySession";
import PomodoroStudySession from "../pages/studySessions/PomodoroStudySession";
import SimulatedTestStudySession from "../pages/studySessions/SimulatedTestStudySession";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicioSesion" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio" element={
          <PrivateRoute>
            <HomeLoginIn />
          </PrivateRoute>
        } />
        <Route
          path="/mazos"
          element={
            <PrivateRoute>
              <MisMazos />
            </PrivateRoute>
          }
        />
        <Route
          path="/mazos/:title"
          element={
            <PrivateRoute>
              <OneDeck />
            </PrivateRoute>
          }
        />
        <Route
          path="/analisis"
          element={
            <PrivateRoute>
              <Analisis />
            </PrivateRoute>
          }
        />
        <Route
          path="/sesionesEstudio"
          element={
            <PrivateRoute>
              <StudySession />
            </PrivateRoute>
          }
        />
        <Route
          path="/sesionesEstudio/regular/:sessionId"
          element={
            <PrivateRoute>
              <RegularStudySession />
            </PrivateRoute>
          }
        />
        <Route
          path="/sesionesEstudio/pomodoro/:sessionId"
          element={
            <PrivateRoute>
              <PomodoroStudySession />
            </PrivateRoute>
          }
        />
        <Route
          path="/sesionesEstudio/simuladas/:sessionId"
          element={
            <PrivateRoute>
              <SimulatedTestStudySession />
            </PrivateRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
