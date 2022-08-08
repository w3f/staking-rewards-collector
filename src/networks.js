/**
 * The primary database for human-added network info. To add a network to this library, one must
 * add its information to this object. The information should include:
 * 
 * ticker:            The commonly accepted ticker for a network's token.
 * normalization:     The multiplier on returned balances for user display. Often called "decimals".
 *                    This parameter is in the inverse, i.e. `1 / 10 ** decimals`.
 * minTime:           The UNIX timestamp (in seconds) before which there is no price data. Helps avoid
 *                    unnecessary API calls.
 * coinGeckoOverride: (Optional) Sometimes the Coin Gecko API requires a name that differs from
 *                    network.
 * subscanOverride:   (Optional) Sometimes the Subscan API requires a name that differs from
 *                    network.
 */
export function getNetworkInfo() {
	return {
		'polkadot' : {
			ticker: 'DOT',
			normalization: 1 / 1e10,
			minTime: 1597708800
		},
		'kusama' : {
			ticker: 'KSM',
			normalization: 1 / 1e12,
			minTime: 1568851200
		},
		'moonriver' : {
			ticker: 'MOVR',
			normalization: 1 / 1e18,
			minTime: 1630022400
		},
		'moonbeam' : {
			ticker: 'GLMR',
			normalization: 1 / 1e18,
			minTime: 1641884400
		},
		'astar' : {
			ticker: 'ASTR',
			normalization: 1 / 1e18,
			minTime: 1642402800
		},
		'shiden' : {
			ticker: 'SDN',
			normalization: 1 / 1e18,
			minTime: 1630303200
		},
		'centrifuge' : {
			ticker: 'CFG',
			coinGeckoOverride: 'wrapped-centrifuge',
			normalization: 1 / 1e18,
			minTime: 1626220800
		},
		'kilt' : {
			ticker: 'KILT',
			coinGeckoOverride: 'kilt-protocol',
			subscanOverride: 'spiritnet',
			normalization: 1 / 1e15,
			minTime: 1638342000
		},
		'crab' : {
			ticker: 'CRAB',
			coinGeckoOverride: 'darwinia-crab-network',
			normalization: 1 / 1e9,
			minTime: 1638342000
		},
		'darwinia' : {
			ticker: 'RING',
			coinGeckoOverride: 'darwinia-network-native-token',
			normalization: 1 / 1e9,
			minTime: 1638342000
		},
		'edgeware' : {
			ticker: 'EDG',
			coinGeckoOverride: 'edgeware',
			normalization: 1 / 1e18,
			minTime: 1638342000
		},
	}
}

/**
 * Returns all supported networks.
 */
export function getSupportedNetworks() {
	return Object.keys(getNetworkInfo());
}

/**
 * Return the Coin Gecko API handle for a given network.
 */
export function getCoinGeckoName(network) {
	const networkInfo = getNetworkInfo();
	let coinGeckoName = network;
	if (Object.keys(networkInfo[network]).includes('coinGeckoOverride')) {
		coinGeckoName = networkInfo[network].coinGeckoOverride;
	}
	return coinGeckoName;
}

/**
 * Return the Subscan identifier for a given network.
 */
export function getSubscanName(network) {
	const networkInfo = getNetworkInfo();
	let subscanName = network;
	if (Object.keys(networkInfo[network]).includes('subscanOverride')) {
		subscanName = networkInfo[network].subscanOverride;
	}
	return subscanName;
}

/**
 * Get the ticker for a given network.
 */
export function getTicker(network) {
	const networkInfo = getNetworkInfo();
    let ticker = 'AAA';
	if (Object.keys(networkInfo).includes(network)) {
		ticker = networkInfo[network].ticker;
	} else {
		console.log(`${network.toUpperCase()} not in the database, using AAA as symbol.`)
	}
	return ticker
}

/**
 * Get the integer offset of tokens for a network.
 */
export function getDenomination(network) {
	const networkInfo = getNetworkInfo();
    let normalization = 1;
    if (Object.keys(networkInfo).includes(network)) {
		normalization = networkInfo[network].normalization;
	} else {
		console.log(`${network.toUpperCase()} not in the database, returning base units.`)
	}
    return normalization;
}

/**
 * Get the earliest timestamp for when price data became available for a network. Price API queries
 * before this point are pointless.
 */
export function getNetworkTimeMinimum(network) {
	const networkInfo = getNetworkInfo();
	let minTime = 1;
	if (Object.keys(networkInfo).includes(network)) {
		minTime = networkInfo[network].minTime;
	} else {
		console.log(`${network.toUpperCase()} not in the database, returning all history.`)
	}
	return minTime;
}

/**
 * Overrides price queries in case the request is for before when data is available.
 */
export function checkPriceAvailablilty(userInput, network) {
    let priceData = userInput.priceData;
    let end = new Date(userInput.end);

    if ((end.valueOf() / 1000) < getNetworkTimeMinimum(network) & priceData == 'true') {
        console.log('Your requested time window lies before prices are available for ' + network.toUpperCase() + '. Switching off price data.');
        priceData = 'false';
    }

    return priceData;
}
