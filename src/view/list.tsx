import React, {useCallback, useEffect, useState} from "react";
import Input from "../components/input/input";
import Button from "../components/button/button";
import Loader from "../components/loader/loader";
import './list.css'
import Api from "../api/api";
import Currency from "../components/currency/currency";
import UserPreference from "../utils/userPreference";
import PriceGraf from "../components/price-graf/price-graf";
import currency from "../components/currency/currency";
import {takeLimit} from "../utils/takeLimit";

const api = Api.getInstance();

const SAVE_KEY = 'currency';
const DEFAULT_CURRENCY = 'DOGE';

function getSavedCurrency() {
	return UserPreference.get<Array<string>>(SAVE_KEY, []);
}

export function last(array: Array<any>) {
	return array[array.length - 1];
}

const List: React.FC = () => {
	const [search, setSearch] = useState<string>(() => Object.keys(getSavedCurrency()).length ? '' : DEFAULT_CURRENCY);
	const [list, setList] = useState<Array<string>>(getSavedCurrency);
	const [currency, setCurrency] = useState<Record<string, Array<number>>>({});
	const [isConnecting, setConnectStatus] = useState<boolean>(false);
	const [selectedCurrency, setSelected] = useState(DEFAULT_CURRENCY);
	const [prices, setPrices] = useState<Array<number>>([]);


	const updateCurrency = useCallback((data: any) => {
		setCurrency((prev) => {
			const newCurrency = prev[data.currency] || [];
			return {
				...prev,
				[data.currency]: takeLimit([...newCurrency, data.newPrice],100)
			}
		});
	}, []);


	useEffect(() => {
		const currencyPrices = currency[selectedCurrency] || [];
		setPrices(currencyPrices);
	}, [selectedCurrency, currency]);

	useEffect(() => {
		api.getPromise().then(() => {
			setConnectStatus(true);
		});
	}, []);

	useEffect(() => {
		UserPreference.save(SAVE_KEY, list);
	}, [list]);

	useEffect(() => {
		if (!isConnecting) return () => {}
		function subscribe() {
			list.forEach(key => {
				api.subscribeToTickerOnWs(key, updateCurrency);
			});
		}

		function unsubscribe() {
			list.forEach(key => {
				api.unsubscribeFromTickerOnWs(key, updateCurrency);
			});
		}

		subscribe()

		return unsubscribe
	}, [isConnecting, list]);


	const addItem = () => {
		const validateCurrency = (currency: string, list: Array<string>) => {
			const isDuplicate = list.includes(currency);
			const isEmpty = currency.length === 0;
			return [isDuplicate, isEmpty].some(_ => _);
		};
		if (validateCurrency(search, list)) return;

		setList( (prev) => ([...prev, search]))
		setSearch('');
	};

	const selectCurrency = (currency: string) => {
		setSelected(currency);
	}

	const removeItem = (currency: string) => {
		setList((list) => list.filter((key) => key !== currency));
		setCurrency((prev) => {
			const newCurrency = {...prev};
			delete newCurrency[currency];
			return newCurrency;
		});
	};

	return (
		<div className="list">
			<Loader isLoading={!isConnecting}/>
			<div className={'Search'}>
				<Input className={'ListInput'} value={search} onChange={setSearch}/>
				<Button onClick={addItem}>+</Button>
			</div>
			<div className="list-wrapper grid gap-4 grid-cols-3">
				{Object.entries(currency).map((value, index, array) => {
					return <Currency onClose={removeItem} onClick={selectCurrency} key={value[0]} currency={value[0]} amount={last(value[1])}/>
				})}
			</div>


			<div className="graf">
				<PriceGraf prices={prices} currency={DEFAULT_CURRENCY}/>
			</div>
		</div>
	);
};


export default List;
