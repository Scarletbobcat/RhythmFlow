import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useAuth } from "src/providers/AuthProvider";

// Mock the AuthProvider
const loginWithEmailMock = vi
  .fn()
  .mockImplementation(async (email: string, password: string) => {
    if (email === "not-found@gmail.com" || password === "wrong-password") {
      return { success: false, error: new Error("Invalid login credentials") };
    }
    if (email === "correct@gmail.com" && password === "correct-password") {
      return { success: true };
    }
    return { success: false, error: new Error("Unknown error") };
  });
vi.mock("src/providers/AuthProvider", () => ({
  useAuth: () => ({
    loginWithEmail: loginWithEmailMock,
  }),
}));

// Mock react-router
vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("LoginForm rendering", () => {
  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm setPage={vi.fn()} />
      </BrowserRouter>
    );
  };

  it("renders the login form", () => {
    renderLoginForm();
    const title = screen.getByText("Log in to RhythmFlow");
    expect(title).toBeInTheDocument();
  });

  it("displays email and password inputs", () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("displays login button", () => {
    renderLoginForm();
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("displays Google login button", () => {
    renderLoginForm();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("shows sign up link", () => {
    renderLoginForm();
    expect(screen.getByText("Sign up for RhythmFlow")).toBeInTheDocument();
  });

  it("shows forgot password link", () => {
    renderLoginForm();
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
  });

  it("allows email input", () => {
    renderLoginForm();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("allows password input", () => {
    renderLoginForm();
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls setPage with false when clicking sign up link", () => {
    const setPageMock = vi.fn();
    render(
      <BrowserRouter>
        <LoginForm setPage={setPageMock} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Sign up for RhythmFlow"));
    expect(setPageMock).toHaveBeenCalledWith(false);
  });

  it("calls setPage with null when clicking forgot password", () => {
    const setPageMock = vi.fn();
    render(
      <BrowserRouter>
        <LoginForm setPage={setPageMock} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Forgot Password"));
    expect(setPageMock).toHaveBeenCalledWith(null);
  });
});

describe("LoginForm functionality", () => {
  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm setPage={vi.fn()} />
      </BrowserRouter>
    );
  };

  it("successfully logs in", async () => {
    renderLoginForm();
    const { loginWithEmail } = useAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByText("Log in");

    const correctCredentials = {
      email: "correct@gmail.com",
      password: "correct-password",
    };

    await userEvent.type(emailInput, correctCredentials.email);
    await userEvent.type(passwordInput, correctCredentials.password);
    await userEvent.click(loginButton);

    expect(loginWithEmail).toHaveBeenCalledWith(
      correctCredentials.email,
      correctCredentials.password
    );
    expect(loginWithEmail).toHaveReturnedWith(
      Promise.resolve({ success: true })
    );
  });

  it("fails to log in with incorrect credentials", async () => {
    renderLoginForm();
    const { loginWithEmail } = useAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByText("Log in");

    const incorrectCredentials = {
      email: "not-found@gmail.com",
      password: "wrong-password",
    };
    await userEvent.type(emailInput, incorrectCredentials.email);
    await userEvent.type(passwordInput, incorrectCredentials.password);
    await userEvent.click(loginButton);
    expect(loginWithEmail).toHaveBeenCalledWith(
      incorrectCredentials.email,
      incorrectCredentials.password
    );
    expect(loginWithEmail).toHaveReturnedWith(
      Promise.resolve({
        success: false,
        error: new Error("Invalid login credentials"),
      })
    );
  });
});
