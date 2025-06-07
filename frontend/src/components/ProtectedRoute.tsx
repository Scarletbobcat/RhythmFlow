import { Navigate } from "react-router";
import { useAuth } from "src/providers/AuthProvider";

import supabase from "src/lib/supabase";
import { useEffect, useState } from "react";
import { AMREntry, AuthenticatorAssuranceLevels } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

interface MFAData {
  currentAuthenticationMethods: AMREntry[];
  currentLevel: AuthenticatorAssuranceLevels | null;
  nextLevel: AuthenticatorAssuranceLevels | null;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { supabaseUser } = useAuth();

  const [data, setData] = useState<MFAData | null>(null);
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

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full flex flex-col select-none">
        Loading...
      </div>
    );
  }

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
