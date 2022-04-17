import React from 'react';
import noop from '../../utils/noop';
import './currency.css';

const Currency: React.FC<{
  currency: string;
  amount?: number;
  className?: string;
  isSelected?: boolean;
  onClose?: (value: string) => void;
  onClick?: (value: string) => void;
}> = ({ currency, amount, className = '', onClose= noop, onClick = noop, isSelected }) => {

  const isSelectedClass = isSelected ? ' selected' : '';
  const classNames = className  + isSelectedClass;

  const handleClose = (event:  React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    onClose(currency);
  };

  const handleClick = (event:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onClick(currency);
  };

  return (
    <div onClick={handleClick} className={classNames + ' relative item transition-all p-6  rounded-xl shadow-lg flex items-center space-x-4 mb-4'}>
      {currency}: {amount}

      <span onClick={handleClose}  className="cursor-pointer absolute top-2 right-2.5">x</span>
    </div>
  );
};

export default Currency;
