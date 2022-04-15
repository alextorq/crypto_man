import React from 'react';
import './button.css';

const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => {
  return (
    <button
        className={'Button'}
        onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
