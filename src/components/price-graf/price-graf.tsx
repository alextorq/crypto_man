import React, {useEffect, useRef, useState} from 'react';
import './price-graf.css';
import {getFromEnd, last, takeRight} from '../../utils/collections';

interface Props {
	prices: Array<number>
	currency: string;
}

const MAX_ITEM = 150;
const WIDTH_CURRENCY = 10;


function observeWith(setWidth: (width: number) => void, grafElement:  React.RefObject<HTMLUListElement>) {
	useEffect(() => {
		const handler = () => {
			setWidth(grafElement.current!.clientWidth);
		};
		handler();
		window.addEventListener('resize', handler);
		return () => window.removeEventListener('resize', handler);
	}, []);
}

function preparePrices(limitedPrice: Array<number>) {
	const maxPrice = Math.max(...limitedPrice);
	const minPrice = Math.min(...limitedPrice);
	const maxPriceDiff = maxPrice - minPrice;
	function getSize(x: number) {
		return ((x - minPrice) * 100 / maxPriceDiff).toFixed(2);
	}

	return limitedPrice.map(getSize);
}

let timer: number|null = null;

const PriceGraf: React.FC<Props> = ({prices= []}) => {
	const mousePosition = useRef<number>(0);
	const grafElement = useRef<HTMLUListElement>(null);
	const [width, setWidth] = useState<number>(1000);
	const [item, setItem] = useState<number>(0);
	const [hoverItem, setHoverItem] = useState<number>(0);

	const limitedPrice = takeRight(prices, MAX_ITEM);
	const pricesSizes =	preparePrices(limitedPrice);
	const lastPrice = last(limitedPrice);

	const mouseSpy = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
		mousePosition.current = e.nativeEvent.offsetX;
	};

	const mouseLeave = () => {
		mousePosition.current = 0;
	};

	useEffect(() => {
		setHoverItem(getFromEnd(limitedPrice, item));
	}, [item, limitedPrice]);

	observeWith(setWidth, grafElement);

	useEffect(() => {
		function calculateItem() {
			timer = window.requestAnimationFrame(calculateItem);
			const i = Math.floor((width - mousePosition.current) / WIDTH_CURRENCY);
			setItem(i);
		}
		calculateItem();
		return () => window.cancelAnimationFrame(timer!);
	}, [width]);


	function classHover(index: number) {
		let className = 'relative';
		if ((limitedPrice.length - index) === item + 1 ) {
			className += ' hover';
		}
		return className;
	}

	return (
		<div>
		<div className="price-grafic">
			<div className="white">
				{hoverItem || lastPrice}: USD
			</div>
				<ul ref={grafElement} onMouseLeave={mouseLeave} onMouseMove={mouseSpy}>
					{pricesSizes.map((item, index) => (
						<li className={classHover(index)} key={item + index} style={{width: WIDTH_CURRENCY + 'px'}}>
							<span className="" style={{height: `${item}%`}}></span>
						</li>
					))}
				</ul>
		</div>
		</div>
	);
};

export default PriceGraf;
