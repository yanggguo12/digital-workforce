import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  leftIcon, 
  rightIcon, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-sap-blue text-white hover:bg-blue-600 active:scale-[0.98]",
    secondary: "bg-sap-gray-900 text-white hover:bg-black active:scale-[0.98]",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    outline: "bg-transparent border border-[#E2E8F0] text-gray-700 hover:border-sap-blue hover:text-sap-blue active:scale-[0.98]",
    success: "bg-sap-success text-white hover:opacity-90 active:scale-[0.98]",
    warning: "bg-sap-warning text-white hover:opacity-90 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-2.5 h-[28px] text-[11px]",
    md: "px-4 h-[32px] text-[13px]",
    lg: "px-6 h-[40px] text-[14px]",
    icon: "w-8 h-8",
  };

  return (
    <button
      className={cn(
        "rounded-[2px] font-bold inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 uppercase tracking-tight",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
