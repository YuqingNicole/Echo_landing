import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  to,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  disabled = false
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full transition-all-smooth transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variantClasses = {
    primary: "bg-echo-gradient text-white hover:shadow-echo-lg hover:scale-105 focus:ring-blue-500",
    secondary: "border-2 border-blue-600 text-blue-600 bg-white/80 hover:bg-blue-600 hover:text-white hover:scale-105 focus:ring-blue-500 backdrop-blur-sm",
    ghost: "text-blue-600 hover:bg-blue-50 hover:scale-105 focus:ring-blue-500"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={`h-5 w-5 ${children ? 'mr-2' : ''} transition-transform ${iconPosition === 'right' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={`h-5 w-5 ${children ? 'ml-2' : ''} transition-transform group-hover:translate-x-1`} />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={classes}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default AnimatedButton;