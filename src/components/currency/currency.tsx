import React, {useEffect} from "react";

const noop = () => {};

const Currency: React.FC<{
  currency: string;
  amount?: number;
  className?: string;
  onClose?: (value: string) => void;
  onClick?: (value: string) => void;
}> = ({ currency, amount, className = '', onClose= noop, onClick = noop }) => {
  const [classUpdate, setClassUpdate] = React.useState('');

  useEffect(() => {
    setTimeout(() => {
      setClassUpdate('');
    }, 1000);
    setClassUpdate(' scale-105');
  }, [amount]);
  const classNames = className + classUpdate;


  const handleClose = (event:  React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    onClose(currency);
  }

  const handleClick = (event:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onClick(currency);
  }

  return (
    <div onClick={handleClick} className={classNames + ' relative transition-all p-6 bg-white rounded-xl shadow-lg flex items-center space-x-4'}>
      {currency}: {amount}

      <span onClick={handleClose}  className="cursor-pointer absolute top-2 right-2.5">x</span>
    </div>
  );
};

export default Currency;
