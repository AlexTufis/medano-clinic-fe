import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#6366f1' 
}) => {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div 
        className="loading-spinner__circle" 
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
