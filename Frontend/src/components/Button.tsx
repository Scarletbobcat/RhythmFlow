import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge(
          `
          disabled:cursor-not-allowed
          disabled:opacity-50
          m-2
          rounded-3xl
          bg-violet-500
          hover:bg-violet-400
          text-white
          p-3
          w-xs
          hover:cursor-pointer
          hover:scale-105
          transition-transform
        `,
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
