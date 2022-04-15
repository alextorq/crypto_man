import React from "react";
import './price-graf.css'
import {takeLimit} from "../../utils/takeLimit";


interface Props {
	prices: Array<number>
  currency: string;
}

const MAX_ITEM = 100;

const PriceGraf: React.FC<Props> = ({prices= []}) => {
	const maxPrice = Math.max(...prices);
	const minPrice = Math.min(...prices);
	const maxPriceDiff = maxPrice - minPrice;

	function getSize(x: number) {
		return ((x - minPrice) * 100 / maxPriceDiff).toFixed(2)
	}
	const pricesSizes = takeLimit(prices, MAX_ITEM).map(getSize);

  return (
	<div className="price-grafic">
		<div className="price-grafic__max">
			{maxPrice}
		</div>
		<div className="price-grafic__line">
		</div>

		<ul>
			{pricesSizes.map((item, index) => (
				<li className="relative" key={item + index} style={{
					height: `${item}%`,
				}}>
					<span className="hover-tooltip bg-white opacity-0 z-10 absolute top-0 left-1/2 transition-all">
						{prices[index]}
					</span>
				</li>
			))}
		</ul>
	</div>
  );
};

export default PriceGraf;
