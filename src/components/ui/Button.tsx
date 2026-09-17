import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] cursor-pointer";

    const variants = {
        primary: "bg-[var(--color-navy)] text-white hover:bg-[#13233d] focus:ring-[var(--color-brand-accent)]/40 shadow-sm hover:shadow-md font-bold",
        secondary: "bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-secondary-dark)] focus:ring-[var(--color-brand-accent)]/40 shadow-sm hover:shadow-md font-bold",
        outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus:ring-[var(--color-primary)]/40",
        ghost: "bg-transparent hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus:ring-[var(--color-primary)]/40",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-4 py-2.5 text-sm gap-2",
        lg: "px-6 py-3 text-base gap-2",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
