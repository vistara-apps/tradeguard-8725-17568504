    export default function Card({ children, className = '' }) {
      return (
        <div className={`p-lg bg-surface rounded-lg shadow-card ${className}`}>
          {children}
        </div>
      );
    }
  