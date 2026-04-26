import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);

  // Если контекст еще не загрузился или пользователь не вошел
  if (!auth?.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}