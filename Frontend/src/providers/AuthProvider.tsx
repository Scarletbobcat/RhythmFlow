import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import supabase from "src/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: Error }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: Error }>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: Error }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        // if (event === "SIGNED_IN" && session?.user) {
        //   navigate("/");
        // }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error };
      }
      return { success: true };
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        return { success: false, error };
      }
      return { success: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          user,
          loading,
          loginWithEmail,
          loginWithGoogle,
          signUpWithEmail,
          logout,
        }),
        [
          user,
          loading,
          loginWithEmail,
          loginWithGoogle,
          signUpWithEmail,
          logout,
        ]
      )}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
