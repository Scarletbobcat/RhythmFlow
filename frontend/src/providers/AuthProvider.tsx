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

import { createUser, getUserById } from "src/api/users";
import { getSongByUser } from "src/api/songs";
import RhythmFlowUser from "src/types/User";
import Song from "src/types/Song";

interface AuthContextType {
  supabaseUser: User | null;
  user: RhythmFlowUser | null;
  loading: boolean;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: Error }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ success: boolean; error?: Error }>;
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: Error }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: Error }>;
  signUpWithEmail: (
    email: string,
    artistName: string,
    password: string
  ) => Promise<{ success: boolean; error?: Error }>;
  logout: () => Promise<void>;
  isMfaEnabled: () => Promise<boolean>;
  fetchRhythmFlowUser: () => Promise<void>;
  userSongs: Song[];
  fetchUserSongs: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<RhythmFlowUser | null>(null);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setSupabaseUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseUser(session?.user || null);
        setUser(null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchRhythmFlowUser = useCallback(async () => {
    if (supabaseUser) {
      try {
        const userData = await getUserById(supabaseUser.id);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }, [supabaseUser]);

  useEffect(() => {
    fetchRhythmFlowUser();
  }, [fetchRhythmFlowUser]);

  const fetchUserSongs = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      const userSongs = await getSongByUser();
      setUserSongs(userSongs);
    } catch (error) {
      console.error("Error fetching user's songs:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserSongs();
  }, [fetchUserSongs, user]);

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

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      return { success: false, error: error as Error };
    }
    return { success: true };
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  }, []);
  const signUpWithEmail = useCallback(
    async (email: string, artistName: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        return { success: false, error };
      }
      try {
        if (data.user) {
          await createUser(data.user, artistName);
        }
      } catch {
        return {
          success: false,
          error: new Error("Error registering user. Please try again later."),
        };
      }
      return { success: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isMfaEnabled = useCallback(async () => {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) {
      console.error("Error checking MFA status:", error);
      return false;
    }
    return (
      (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) ||
      (data.currentLevel === "aal2" && data.nextLevel === "aal2")
    );
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          supabaseUser,
          user,
          loading,
          loginWithEmail,
          loginWithGoogle,
          signUpWithEmail,
          logout,
          forgotPassword,
          updatePassword,
          isMfaEnabled,
          fetchRhythmFlowUser,
          userSongs,
          fetchUserSongs,
        }),
        [
          supabaseUser,
          user,
          loading,
          loginWithEmail,
          loginWithGoogle,
          signUpWithEmail,
          logout,
          forgotPassword,
          updatePassword,
          isMfaEnabled,
          fetchRhythmFlowUser,
          userSongs,
          fetchUserSongs,
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
