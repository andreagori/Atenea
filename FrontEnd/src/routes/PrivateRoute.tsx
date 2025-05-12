import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { JSX } from "react";

// This component is used to protect routes that require authentication
// If the user is not authenticated, they will be redirected to the login page
export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("auth_token");

  // Check if the token exists
    if (!token) {
    return <Navigate to="/inicioSesion" />;
  }

  return children;
};

