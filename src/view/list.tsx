import React, {FormEvent, useCallback, useEffect, useState} from 'react';
import Input from '../components/input/input';
import Button from '../components/button/button';
import Loader from '../components/loader/loader';
import './list.css';
import Api from '../api/api';
import Currency from '../components/currency/currency';
import UserPreference from '../utils/userPreference';
import PriceGraf from '../components/price-graf/price-graf';
import currency from '../components/currency/currency';
import {takeRight, last} from '../utils/collections';
import noop from '../utils/noop';

import Select from '../components/select/select';

import {Sort, sortOptions} from '../utils/sort';

const api = Api.getInstance();

const SAVE_KEY = 'currency';
const SAVE_KEY_SORT = 'sort_direction';
const SAVE_KEY_SELECTED_CURRENCY = 'currency_selected';
const DEFAULT_CURRENCY = 'DOGE';

function getSavedCurrency() {
	return UserPreference.get<Array<string>>(SAVE_KEY, []);
}
function getSavedSortDirection() {
	return UserPreference.get<Sort>(SAVE_KEY_SORT, Sort.DEFAULT);
}

function getSavedSelectedCurrency() {
	return UserPreference.get<string>(SAVE_KEY_SELECTED_CURRENCY, '');
}

function savePreference(sortBy: Sort, list: Array<string>, selectedCurrency: string) {
	useEffect(() => {
		UserPreference.save(SAVE_KEY_SORT, sortBy);
		UserPreference.save(SAVE_KEY_SELECTED_CURRENCY, selectedCurrency);
		UserPreference.save(SAVE_KEY, list);
	}, [sortBy, list, selectedCurrency]);
}

function getInitialCurrencyPrice(list: Array<string>, updateCurrency: (data: any) => void) {
	useEffect(() => {
		list.forEach((currency) => {
			api.getPrice(currency).then((data) => {
				updateCurrency({currency, newPrice: data});
			});
		});
	}, []);
}

function sortByPrice(currencyItems:  [string, number[]][], sortDirection: Sort) {
	const items = [...currencyItems];
	return items.sort((a, b) => {
		const [, valueA] = a;
		const [, valueB] = b;
		if (sortDirection === Sort.ASC) {
			return valueA[0] - valueB[0];
		}
		return valueB[0] - valueA[0];
	});
}



const List: React.FC = () => {
	const [search, setSearch] = useState<string>(() => Object.keys(getSavedCurrency()).length ? '' : DEFAULT_CURRENCY);
	const [list, setList] = useState<Array<string>>(getSavedCurrency);
	const [currency, setCurrency] = useState<Record<string, Array<number>>>({});
	const [isConnecting, setConnectStatus] = useState<boolean>(false);
	const [selectedCurrency, setSelected] = useState(getSavedSelectedCurrency);
	const [prices, setPrices] = useState<Array<number>>([]);
	const [sortBy, setSortBy] = useState<Sort>(getSavedSortDirection);

	const updateCurrency = useCallback((data: Record<string, unknown>) => {
		setCurrency((prev) => {
			const key = data.currency as string;
			const newCurrency = prev[key] || [];
			return {
				...prev,
				[key]: takeRight([...newCurrency, data.newPrice as number],100)
			};
		});
	}, []);

	getInitialCurrencyPrice(list, updateCurrency);
	savePreference(sortBy, list, selectedCurrency);

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
		if (!isConnecting) return noop;
		function subscribe() {
			list.forEach(key => {
				api.subscribeToTickerOnWs(key, updateCurrency as any);
			});
		}

		function unsubscribe() {
			list.forEach(key => {
				api.unsubscribeFromTickerOnWs(key, updateCurrency as any);
			});
		}

		subscribe();

		return unsubscribe;
	}, [isConnecting, list]);


	const addItem = async (e?: FormEvent<HTMLFormElement>) => {
		e && e.preventDefault();
		const validateCurrency = async (currency: string, list: Array<string>) => {
			const isDuplicate = list.includes(currency);
			const isEmpty = currency.length === 0;
			let isNotExist = false;
			await api.checkExist(currency).then((exist) => {
				isNotExist = !exist;
			});
			if (isDuplicate) {
				alert('This currency already exist');
			}
			if (isEmpty) {
				alert('Please enter currency');
			}
			if (isNotExist) {
				alert('This currency does not exist');
			}
			return [isDuplicate, isEmpty, isNotExist].some(_ => _);
		};
		if (await validateCurrency(search, list)) return;
		setList( (prev) => ([...prev, search]));
		const USD = await api.getPrice(search);
		updateCurrency({currency: search, newPrice: USD});
		setSearch('');
	};

	const selectCurrency = (currency: string) => {
		setSelected(currency);
	};

	const removeItem = (currency: string) => {
		setList((list) => list.filter((key) => key !== currency));
		setCurrency((prev) => {
			const newCurrency = {...prev};
			delete newCurrency[currency];
			return newCurrency;
		});
	};

	let currencyItems = Object.entries(currency);
	if (sortBy !== Sort.DEFAULT) {
		currencyItems = sortByPrice(currencyItems, sortBy);
	}

	return (
		<div className="list main">
			<Loader isLoading={!isConnecting}/>
			<div>
				<form onSubmit={addItem} className={'Search'}>
					<Input className={'ListInput'} value={search} onChange={setSearch}/>
					<Button onClick={addItem}>+</Button>
				</form>
				<div>
					<Select onChange={setSortBy} value={sortBy} options={sortOptions}/>
				</div>
				<div className="list-wrapper">
					{currencyItems.map((value) => {
						return <Currency onClose={removeItem}
											isSelected={selectedCurrency === value[0]}
											onClick={selectCurrency}
											key={value[0]}
											currency={value[0]}
											amount={last(value[1])}/>;
					})}
				</div>


			</div>

			<div className="graf">
				<PriceGraf prices={prices} currency={DEFAULT_CURRENCY}/>
			</div>
		</div>
	);
};

export default List;
