import CoinGecko from "coingecko-api";
import { getCoinGeckoName, getNetworkInfo } from "./networks.js";
import { sleep } from "./utils.js";

export const coingeckoService = {
  async getPrices(obj, start, end) {
    const CoinGeckoClient = new CoinGecko();
    let priceObject;

    try {
      await sleep(100);
      priceObject = await CoinGeckoClient.coins.fetchMarketChartRange(
        getCoinGeckoName(obj.network),
        {
          from: start,
          to: end,
          vs_currency: obj.currency,
        }
      );

      if (priceObject.success !== true) {
        throw new Error(
          "The API request to CoinGecko was not successful: " +
            priceObject.message
        );
      }

      return priceObject.data;
    } catch (e) {
      console.log("Error in parsing CoinGecko Data: " + e);
      throw e;
    }
  },

  /**
   * Formats the price data received from the CoinGecko API.
   * The CoinGecko API returns a list of arrays, where each array
   * contains a timestamp and a value (either price or volume).
   * This function converts the raw data into an array of objects
   * with `timestamp` and the specified `key` (either "price" or "volume").
   */
  formatPriceData(data, key) {
    const array = key === "price" ? data.prices : data.total_volumes;
    return array.map((item) => ({
      timestamp: item[0] / 1000,
      [key]: item[1],
    }));
  },
};

export const cryptocompareService = {
  async getPrices(obj, start, end) {
    const baseUrl = "https://min-api.cryptocompare.com/data/v2/histoday";

    const networkInfo = getNetworkInfo()[obj.network];
    const ticker = networkInfo?.ticker || obj.network;
    const numDays = Math.floor((end - start) / (24 * 3600)) + 1;

    const url = `${baseUrl}?fsym=${ticker}&tsym=${obj.currency}&limit=${numDays}&toTs=${end}`;

    try {
      await sleep(100);
      const response = await fetch(url);
      const responseData = await response.json();

      if (responseData.Response !== "Success") {
        throw new Error(
          "The API request to CryptoCompare was not successful: " +
            responseData.Message
        );
      }

      return responseData.Data.Data;
    } catch (e) {
      console.log("Error fetching CryptoCompare Data: " + e);
      throw e;
    }
  },

  /**
   * Formats the price data received from the CryptoCompare API.
   * The CryptoCompare API returns an array of objects, where each object
   * has `time` and `close` (for price) or `volumeto` (for volume) properties.
   * This function converts the raw data into an array of objects
   * with `timestamp` and the specified `key` (either "price" or "volume").
   */
  formatPriceData(data, key) {
    return data.map((item) => ({
      timestamp: item.time,
      [key]: key === "price" ? item.close : item.volumeto,
    }));
  },
};
