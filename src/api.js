import { coingeckoService, cryptocompareService } from "./priceApiServices.js";
import { round } from "mathjs";
import { getNetworkTimeMinimum } from "./networks.js";
import { transformDDMMYYYtoUnix } from "./utils.js";

export const PRICE_APIS = {
  COINGECKO: "coingecko",
  CRYPTOCOMPARE: "cryptocompare",
  // NEWAPI: 'newapi',
};

// API Service registry
const priceApis = {
  [PRICE_APIS.COINGECKO]: coingeckoService,
  [PRICE_APIS.CRYPTOCOMPARE]: cryptocompareService,
};

// Service selector function
function getPriceApi(serviceType) {
  const service = priceApis[serviceType.toLowerCase()];
  if (!service) {
    throw new Error(`Unsupported API service: ${serviceType}`);
  }
  return service;
}

export async function addPriceData(obj) {
  const priceApi = getPriceApi(obj.priceApi || PRICE_APIS.COINGECKO);

  let start = transformDDMMYYYtoUnix(obj.data.list[0].day);
  let end = transformDDMMYYYtoUnix(obj.data.list.slice(-1)[0].day);
  // Avoid getting hourly or minute price data.
  end = _checkDuration(start, end);

  const priceData = await priceApi.getPrices(obj, start, end);
  const prices = priceApi.formatPriceData(priceData, "price");
  const total_volume = priceApi.formatPriceData(priceData, "volume");

  // set index to first day price were available to avoid looking for prices where are none
  let i = _setIndex(obj);

  for (i; i < obj.data.list.length; i++) {
    let tmp = transformDDMMYYYtoUnix(obj.data.list[i].day);
    let priceEntry = prices.find((x) => x.timestamp >= tmp);
    let volumeEntry = total_volume.find((x) => x.timestamp >= tmp);
    obj.data.list[i].price = round(priceEntry.price, 2);
    obj.data.list[i].volume = volumeEntry.volume;
  }
  return obj;
}

/**
 * This function checks if the user did input a time-period larger than 90 days. Minutely data will
 * be provided for duration within 1 day and  Hourly data will be used for duration between 1 day
 * and 90 days. We are only interested in daily data, so we check if the duration is less than 90
 * days and then just increase it artificially (only the prices within the time-period of the user
 * will be used later).
 */
function _checkDuration(start, end) {
  var setEnd;

  let duration = (end - start) / 60 / 60 / 24;

  if (duration < 90) {
    setEnd = start + 91 * 60 * 60 * 24;
  } else {
    setEnd = end;
  }
  return setEnd;
}

/*
This function checks when prices were available and sets the index correspondingly to avoid looking for prices when there were none available.
*/
function _setIndex(obj) {
  var index;
  let network = obj.network;

  index = obj.data.list.findIndex(
    (x) => transformDDMMYYYtoUnix(x.day) >= getNetworkTimeMinimum(network)
  );

  if (index < 0) {
    index = 0;
  }

  return index;
}
