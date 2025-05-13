import { Navigate } from "react-router";

import { useAuth } from "src/providers/AuthProvider";
import LoginForm from "./components/LoginForm";
import { useState } from "react";
import RegisterForm from "./components/RegisterForm";

function Login() {
  const { supabaseUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen bg-gradient-to-t from-black from-20% to-violet-700">
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="min-w-[300px] p-10 bg-neutral-900 w-xl rounded-xl flex flex-col items-center">
          {supabaseUser && <Navigate to="/" />}
          {isLogin ? (
            <LoginForm setIsLogin={setIsLogin} />
          ) : (
            <RegisterForm setIsLogin={setIsLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
