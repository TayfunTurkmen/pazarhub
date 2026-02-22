export default function Card({
    children,
    className = '',
    onClick
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
    return (
        <div
            className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm hover:shadow-md ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
