import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SettingsProvider } from "../context/SettingsContext";

/** Gate for authenticated routes. Loads user settings once past the gate. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <SettingsProvider>
      <Outlet />
    </SettingsProvider>
  );
}
