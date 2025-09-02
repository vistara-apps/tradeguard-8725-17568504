    'use client';

    interface ButtonProps {
      children: React.ReactNode;
      onClick?: () => void;
      variant: 'primary' | 'secondary' | 'destructive' | 'outline';
      className?: string;
    }

    export default function Button({
      children,
      onClick,
      variant,
      className = '',
    }: ButtonProps) {
      const base = 'px-lg py-md rounded-md font-semibold transition duration-base ease';
      let styles = '';
      switch (variant) {
        case 'primary':
          styles = 'bg-primary text-bg hover:bg-opacity-90';
          break;
        case 'secondary':
          styles = 'bg-surface text-text-primary hover:bg-opacity-90';
          break;
        case 'destructive':
          styles = 'bg-red-500 text-bg hover:bg-red-600';
          break;
        case 'outline':
          styles = 'border border-primary text-primary hover:bg-primary hover:text-bg';
          break;
      }
      return (
        <button onClick={onClick} className={`${base} ${styles} ${className}`}>
          {children}
        </button>
      );
    }
  