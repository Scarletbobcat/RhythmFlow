import { Navigate } from "react-router";
import { useAuth } from "src/providers/AuthProvider";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { supabaseUser } = useAuth();

  if (!supabaseUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;
