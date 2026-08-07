import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  theme?: 'light' | 'dark';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, theme = 'light', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label className={cn(
          "text-xs font-medium tracking-[1px] uppercase",
          theme === 'dark' ? "text-white/60" : "text-textSecondary"
        )}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full h-12 bg-transparent border-b outline-none transition-colors duration-300 font-light",
              theme === 'dark' 
                ? "border-white/20 focus:border-white text-white placeholder:text-white/40"
                : "border-black/10 focus:border-black text-textPrimary placeholder:text-textSecondary/50",
              isPassword && "pr-10",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 w-10 h-full flex items-center justify-center transition-colors",
                theme === 'dark' ? "text-white/60 hover:text-white" : "text-textSecondary hover:text-textPrimary"
              )}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
