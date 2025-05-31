import { Navigate } from "react-router";
import { useAuth } from "src/providers/AuthProvider";

import supabase from "src/lib/supabase";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { supabaseUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkMFA = async () => {
      setLoading(true);
      const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      setData(data);
      setLoading(false);
    };
    if (supabaseUser) {
      checkMFA();
    }
  }, [supabaseUser]);

  if (
    data !== null &&
    data.nextLevel === "aal2" &&
    data.nextLevel !== data.currentLevel
  ) {
    return <Navigate to="/mfa" replace />;
  }

  if (!supabaseUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;
