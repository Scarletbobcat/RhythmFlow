import { Navigate } from "react-router";
// import { useState } from "react";

import { useAuth } from "src/providers/AuthProvider";
import LoginForm from "./components/LoginForm";

function Login() {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-gradient-to-t from-black from-20% to-violet-700">
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="min-w-[300px] p-10 bg-neutral-900 w-xl rounded-xl flex flex-col items-center">
          {user && <Navigate to="/" />}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
