'use client';

import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
    
    const variantStyles = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-900 hover:bg-gray-100 focus:ring-blue-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    
    const sizeStyles = {
      default: 'px-4 py-2 text-base',
      sm: 'px-3 py-1.5 text-sm',
      lg: 'px-6 py-3 text-lg',
    };
    
    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    
    return (
      <button
        ref={ref}
        className={finalClassName}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
