import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./providers/AuthProvider";
import { MusicProvider } from "./providers/MusicProvider";
import { ToastContainer } from "react-toastify";
import ResetPassword from "./pages/ResetPassword";
import MFA from "./pages/MFA";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <AuthProvider>
          <MusicProvider>
            <QueryClientProvider client={new QueryClient()}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/mfa" element={<MFA />} />
                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedRoute>
                        <Search />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test"
                    element={
                      <ProtectedRoute>
                        <Test />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QueryClientProvider>
          </MusicProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
