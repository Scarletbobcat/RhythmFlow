import { Navigate } from "react-router";
import { useAuth } from "src/providers/AuthProvider";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;
