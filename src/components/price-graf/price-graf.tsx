import React, {useEffect, useRef, useState} from 'react';
import './price-graf.css';
import {getFromEnd, last, takeRight} from '../../utils/collections';

interface Props {
	prices: Array<number>
	currency: string;
}


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
		return Math.max(((x - minPrice) * 100 / maxPriceDiff), 1).toFixed(2);
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
	const [widthCurrency, setWidthCurrency] = useState<number>(10);
	const [maxCurrencyItemsList, setMaxCurrencyItemsList] = useState<number>(100);

	const limitedPrice = takeRight(prices, maxCurrencyItemsList);
	const pricesSizes =	preparePrices(limitedPrice);
	const lastPrice = last(limitedPrice);

	const mouseSpy = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
		mousePosition.current = e.nativeEvent.offsetX;
	};

	const zoom = (e: React.WheelEvent<HTMLDivElement>) => {
		const delta = e.deltaY;
		const direction = Math.abs(delta) / delta;
		if(isNaN(direction)) return;
		setWidthCurrency(Math.min(Math.max(widthCurrency + direction, 8), 20));
		setMaxCurrencyItemsList(Math.min(Math.max(maxCurrencyItemsList + direction, 100), 1000));
	};

	const mouseLeave = () => {
		mousePosition.current = 0;
	};

	useEffect(() => {
		setHoverItem(getFromEnd(limitedPrice, item));
	}, [item, limitedPrice, widthCurrency]);

	observeWith(setWidth, grafElement);

	useEffect(() => {
		function calculateItem() {
			timer = window.requestAnimationFrame(calculateItem);
			console.log(widthCurrency);
			const i = Math.floor((width - mousePosition.current) / widthCurrency);
			setItem(i);
		}
		calculateItem();
		return () => window.cancelAnimationFrame(timer!);
	}, [width, widthCurrency]);


	function classHover(index: number) {
		let className = 'relative';
		if ((limitedPrice.length - index) === item + 1 ) {
			className += ' hover';
		}
		return className;
	}

	const isPriceExist = limitedPrice.length > 0;

	return (
		<div>
			<div className="price-grafic" onWheel={zoom}>
					{isPriceExist && (
						<div className="white">
							{hoverItem || lastPrice}: USD
						</div>
					)}
					<ul ref={grafElement} onMouseLeave={mouseLeave} onMouseMove={mouseSpy}>
						{pricesSizes.map((item, index) => (
							<li className={classHover(index)} key={item + index} style={{width: widthCurrency + 'px'}}>
								<span className="" style={{height: `${item}%`}}></span>
							</li>
						))}
					</ul>
			</div>
		</div>
	);
};

export default PriceGraf;
