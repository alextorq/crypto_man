import React, {useEffect} from 'react';
import './select.css';

type numberString = string | number;

export type options<T> = {
	value: T;
	label: T;
};

interface Props<T> {
  options: options<T>[];
  onChange: (value: T) => void;
  value: T;
}

const select = <T extends numberString>(props: React.PropsWithChildren<Props<T>>): React.ReactElement => {
  const { options = [], onChange, value = '' } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSelect = (e:  React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
	e.stopPropagation();
	e.preventDefault();
	setIsOpen(!isOpen);
  };

	useEffect(() => {
		const callback = () => setIsOpen(false);
		function subscribeClick() {
			document.addEventListener('click', callback, {passive: true});
		}
		function unsubscribeClick() {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			document.removeEventListener('click', callback, {passive: true});
		}

		subscribeClick();
		return unsubscribeClick;
	}, []);

  const className = isOpen ? 'select open' : 'select';
  const selectOptionClass = (option: options<T>) => option.value === value ? 'select_option selected' : 'select_option';
  return (
		<div onClick={toggleSelect} className={className} >
			<div className="select_value">{value}</div>
			<ul className="select_options">
				{options.map((option) => {
					return (
						<li
							className={selectOptionClass(option)}
							key={option.value}
							onClick={() => onChange(option.value)}>
							{option.label}
						</li>);
				})}
			</ul>
			<div className="select-arrow"></div>
		</div>
  );
};

export default select;
