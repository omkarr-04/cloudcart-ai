import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-sky-600 text-white hover:bg-sky-500',
  secondary: 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500'
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
