import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  type?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, type = "text", icon, ...props }, ref) => {
    return (
      <div>
        {icon && (
          <div
            className={`absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-400`}
          >
            {icon}
          </div>
        )}
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
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
