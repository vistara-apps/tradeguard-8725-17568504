    interface CardProps {
      children: React.ReactNode;
      className?: string;
    }

    export default function Card({ children, className = '' }: CardProps) {
      return (
        <div className={`p-lg bg-surface rounded-lg shadow-card ${className}`}>
          {children}
        </div>
      );
    }
  