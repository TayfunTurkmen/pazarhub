import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`w-full px-3.5 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] ${error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20' : ''
                        } ${className}`}
                    {...props}
                />
                {error && <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
