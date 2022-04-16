// const API_KEY = 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY';
import eventEmitter from '../utils/eventEmitter';

const API_KEY = '380ec498044c900f249ad39326e8320a2cb4ee09b94afe4dff6911e37ef56bfc';

const URL = `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`;
const AGGREGATE_INDEX = '5';
import {cb} from '../utils/eventEmitter';


//TODO reconnect event
class Api {
    private socket: WebSocket;
    private connecting!: Promise<void>;
    private static instance: Api;
    private constructor() {
        this.socket = new WebSocket(URL);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.createPromise();
    }

    createPromise() {
        this.connecting = new Promise((resolve, reject) => {
            this.socket.addEventListener('open', () => {
                resolve();
            });
            this.socket.addEventListener('error', () => {
                reject();
            });
        });
    }

    getPromise() {
        return this.connecting;
    }

    onOpen() {
        console.log('connected');
    }

    onClose() {
        console.log('closed');
    }

    onError(error: unknown) {
        console.log(error);
    }

    send(message: unknown) {
        this.socket.send(JSON.stringify(message));
    }

    subscribeToTickerOnWs(ticker: string, cb: cb) {
        this.send({
            action: 'SubAdd',
            subs: [`5~CCCAGG~${ticker}~USD`]
        });

        eventEmitter.on(ticker, cb);
    }

    unsubscribeFromTickerOnWs(ticker: string, cb: cb) {
        this.send({
            action: 'SubRemove',
            subs: [`5~CCCAGG~${ticker}~USD`]
        });
        eventEmitter.off(ticker, cb);
    }

    onMessage(event: MessageEvent) {
        const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
            event.data
        );
        if (type !== AGGREGATE_INDEX || newPrice === undefined) {
            return;
        }
        eventEmitter.emit(currency, {
            currency,
            newPrice
        });
    }

	async getPrice(ticker: string) {
		return await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${ticker}&tsyms=USD`)
			.then(res => res.json())
			.then(res => res.USD);
	}

	//TODO change
    async checkExist(ticker: string) {
        return await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${ticker}&tsyms=USD`)
            .then(res => res.json())
            .then(res => res.Response !== 'Error');
    }

    static getInstance() {
        if (!Api.instance) {
            Api.instance = new Api();
        }
        return Api.instance;
    }
}

export default Api;
