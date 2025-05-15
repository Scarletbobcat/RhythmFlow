import { Navigate } from "react-router";

import { useAuth } from "src/providers/AuthProvider";
import LoginForm from "./components/LoginForm";
import { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/ForgotPassword";

function Login() {
  const { supabaseUser } = useAuth();
  const [page, setPage] = useState<boolean | null>(true);

  return (
    <div className="h-screen bg-gradient-to-t from-black from-20% to-violet-700">
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="min-w-[300px] p-10 bg-neutral-900 w-xl rounded-xl flex flex-col items-center">
          {supabaseUser && <Navigate to="/" />}
          {page === true && <LoginForm setPage={setPage} />}
          {page === false && <RegisterForm setPage={setPage} />}
          {page === null && <ForgotPassword setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}

export default Login;
