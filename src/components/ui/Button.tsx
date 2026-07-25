import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    const baseStyles = "relative flex items-center justify-center font-medium transition-all duration-500 overflow-hidden rounded-full";
    
    const variants = {
      primary: "bg-[#111111] text-white hover:bg-black/80 h-14 px-8",
      secondary: "bg-luxuryBlue text-white hover:bg-luxuryBlue/80 h-14 px-8",
      outline: "border border-black/10 text-textPrimary hover:border-black h-14 px-8",
      glass: "glass-button text-white hover:bg-white hover:text-black h-14 px-8",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={cn(baseStyles, variants[variant], isLoading && "opacity-70 cursor-not-allowed", className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
