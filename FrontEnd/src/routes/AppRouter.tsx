import { type JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { AppShell } from "@/components/layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeLoginIn from "../pages/HomeLoginIn";
import MisMazos from "../pages/decks/MyDecks";
import OneDeck from "../pages/decks/OneDeck";
import Analisis from "../pages/Analysis";
import StudySession from "../pages/studySessions/StudySession";
import RegularStudySession from "../pages/studySessions/RegularStudySession";
import PomodoroStudySession from "../pages/studySessions/PomodoroStudySession";
import SimulatedTestStudySession from "../pages/studySessions/SimulatedTestStudySession";

/**
 * Wraps a page in the auth gate + the V2 shell layout.
 * Public routes (Home, Login, Register) intentionally bypass this — their
 * V2 PublicLayout is mounted as part of the welcome-page migration.
 */
const Private = ({ children }: { children: JSX.Element }) => (
  <PrivateRoute>
    <AppShell>{children}</AppShell>
  </PrivateRoute>
);

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inicioSesion" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      <Route
        path="/inicio"
        element={
          <Private>
            <HomeLoginIn />
          </Private>
        }
      />
      <Route
        path="/mazos"
        element={
          <Private>
            <MisMazos />
          </Private>
        }
      />
      <Route
        path="/mazos/:title"
        element={
          <Private>
            <OneDeck />
          </Private>
        }
      />
      <Route
        path="/analisis"
        element={
          <Private>
            <Analisis />
          </Private>
        }
      />
      <Route
        path="/sesionesEstudio"
        element={
          <Private>
            <StudySession />
          </Private>
        }
      />
      <Route
        path="/sesionesEstudio/regular/:sessionId"
        element={
          <Private>
            <RegularStudySession />
          </Private>
        }
      />
      <Route
        path="/sesionesEstudio/pomodoro/:sessionId"
        element={
          <Private>
            <PomodoroStudySession />
          </Private>
        }
      />
      <Route
        path="/sesionesEstudio/simuladas/:sessionId"
        element={
          <Private>
            <SimulatedTestStudySession />
          </Private>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
