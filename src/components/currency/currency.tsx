import React, {useEffect, useRef, useState} from 'react';
import noop from '../../utils/noop';
import './currency.css';

import {usePrevProps} from '../../utils/hooks';

const ANIMATION_CHANGE_DURATION = 700;

const calculateClass = (prev?: number, current?: number) => {
	let className = 'currency-item--no-change';
	if (prev && current) {
		if (prev > current) {
			className = 'currency-item--decrease';
		} else if (prev < current) {
			className =  'currency-item--up';
		}
	}
	return className;
};

const Currency: React.FC<{
  currency: string;
  amount?: number;
  className?: string;
  isSelected?: boolean;
  onClose?: (value: string) => void;
  onClick?: (value: string) => void;
}> = ({ currency, amount, className = '', onClose= noop, onClick = noop, isSelected }) => {
	const [changeClass, setChangeClass] = useState(() => calculateClass(undefined, amount));
	const prevProps = usePrevProps(amount);
	const timer = useRef<number|undefined>();

	useEffect(() => {
		window.clearTimeout(timer.current);
		setChangeClass(calculateClass(prevProps, amount));
		timer.current = window.setTimeout(setChangeClass, ANIMATION_CHANGE_DURATION, 'currency-item--no-change');
	}, [amount]);

	const isSelectedClass = isSelected ? 'selected' : '';
	const classNames = `${className} ${isSelectedClass} ${changeClass}`;

	const handleClose = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
			<button onClick={handleClose}  className="cursor-pointer close absolute top-2 right-2.5"></button>
		</div>
  );
};

export default Currency;
