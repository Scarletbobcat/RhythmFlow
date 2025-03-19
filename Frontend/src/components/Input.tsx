import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          `
          disabled:cursor-not-allowed
          bg-neutral-900
          border-1
          border-neutral-500
          focus:outline-white
          focus:outline-2
          hover:border-neutral-300
          rounded-sm
          p-3
          w-xs
          `,
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      ></input>
    );
  }
);

Input.displayName = "Input";

export default Input;
