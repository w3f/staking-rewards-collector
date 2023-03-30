# Staking Rewards Collector v1.7.1

# Disclaimer
Everyone using this tool does so at his/her own risk. Neither I nor Web3 Foundation guarantee that any data collected is valid and every user is responsible for double-checking the results of this tool. In addition to potential bugs in this code, you are relying on third-party data: Subscan's API is used to collect staking data and CoinGecko's API is used to collect daily price data.

**This is no tax advice**: Every user is responsible to do his/her own research about how stake rewards are taxable in his/her regulatory framework.

# Changelog
## Version 1.8.0
* Added apiSleepDelay config (optional)
## Version 1.7.1
* Reduced the load on CoinGecko's API and some minor code cleanup (thanks to joepetrowski).
## Version 1.7.0
* Changed format of the account-level csv-outputs. We switched from a "per-day" format to a "per-payout" format to get more granular information. (thanks to rphmeier)
* Added the EventID of each staking reward to the csv-outputs.
* Fixed a small bug with timestamps and a function that lead the script to try to access unavailable prices leading to a "price undefined" error.

Thanks to the contributors.

For all changes see the changelog.md

# What can it do?
* Collect staking rewards for a given public address (currently Polkadot, Kusama, Moonriver, Moonbeam, Shiden, Astar, Centrifuge, KILT) for a user-specified time window. The tool calculates the sum of staking rewards within that period.
* If the time window allows it (check below some requirements for `start` and `end` date), it also collects daily price data and the fiat value of a stake reward given that day's **opening price**.
* If a meaningful startBalance (in the token itself) is provided, it can calculate the annualized return rate (extrapolated from your time window to one year).
* The output is stored in table format as CSV file and as JSON object (with more detailed information). For easier processing of multiple addresses, the file names also contain the address.

# How to run?
## Requirements:
* yarn: https://classic.yarnpkg.com/en/docs/install/
* node: 12.20.0 -> there might be a syntax error if run with older versions of nodejs

```bash
git clone git@github.com:w3f/staking-rewards-collector.git
cd staking-rewards-collector
cp config/userInput.json.sample config/userInput.json
# Change the parameters inside the config/userInput.json to your needs.
yarn
yarn start
```
# Tutorial
For a more detailed tutorial on how to set up the script, please go [here](https://hackmd.io/@8F4MrJhQT32fynUEzuSsHA/HJ_A8Jd-O).

# How to use it?
## Input
The program takes several inputs in the `config/userInput.json` file.

Staking Rewards:
* **addresses**: A list of objects containing the `address` you want to parse the staking rewards, the `name` of your address and the `startBalance`. It also contains a field `network`, where users can specify their address belonging to: `Polkadot`, `Kusama`, `Moonriver`, `Moonbeam`, `Shiden`, `Astar`, `Centrifuge`, `KILT`.
* **startBalance**: The amount of tokens from which the staking rewards are generated at the time of the `start`. Used to calculate the annualizedReturn, can be set to any number if the user is not interested in an accurate annualized return metric.
* **start** (YYYY-MM-DD): The earliest day you want to analyze. Note that the earliest available prices: Polkadot (2020-08-19), Kusama (2019-09-20) Moonriver (2021-08-26), Moonbeam (2022-01-11), Shiden (2021-08-30), Astar (2022-01-17), Centrifuge (2022-07-13), KILT (2021-12-01). Prices are set to 0 before that.
* **end** (YYYY-MM-DD): The most recent day you want to analyze.
* **subscan_apikey**: You can apply for a developer apikey from [subscan.io](https://support.subscan.io/#introduction) to skip api call rate limit.


Price Data:
* **currency**: In what currency you would like to have your value expressed (allowed: "CHF", "USD", "EUR", "GBP" and others available at CoinGecko.com).
* **priceData**: Do you want to look up price data for your specified range? (allowed: "true", "false").

Output:
* **exportOutput**: Specify if you want the .csv and .json files to be exported (allowed: "true", "false").
* **exportPrefix**: Specify a prefix appended to all files exported. (e.g. "out/" leads to all files being written in "out/")

## Output
After the tool executed successfully, it creates two files in the root folder. The JSON file contains some meta-data (e.g., sum of rewards and estimate of annualized return rate) and the CSV file gives the most important information in a table and thereby printable format.

### CSV Output
The CSV output file contains a row for every payout within the time frame where at least one staking reward occurred. Example output:

https://i.imgur.com/4LCsDOc.png


### JSON Output
The JSON output file contains a summary of the data as well as a list of objects for every day of the specified time-period (regardless of whether staking rewards occured). If your standard OS text editor does not format the file properly, you can copy the data and insert it to http://jsonviewer.stack.hu/ (click at "format" after paste). Example output:

https://i.imgur.com/QwXEGIN.png

The **JSON Output** contains:

### Summary

* Some information of your inputs (address, network, currency, startBalance).
* **firstReward**: The day specified within your window you received your first reward.
* **lastReward**: The day specified within your window you received your last reward.
* **annualizedReturn**: The annualized return rate of your investment (if you provided a reasonable value for `startBalance`). The basis of this calculation is those days between `firstReward` and `lastReward`. It is only reasonable if you did not change too much in your staking situation (like deposited, withdraw etc.).
* **currentValueRewardsFiat**: The current value of the staking rewards (at the most recent daily price specified by your time window).
* **totalAmountHumanReadable**: The sum of staking rewards within your specified period in (new DOT or KSM).
* **totalValueFiat**: The value of the staking rewards **based on daily prices they were received**.

### Additional Data

* **numberRewardsParsed**: The number of found staking rewards.
* **numberOfDays**: The days between `start` and `end`.

### List of objects

A list with objects for every day in your specified range. In the price of numbers (e.g. `amountPlank`) multiple staking rewards are added. In the case of strings, those are concanated.

# Troubleshooting
* `SyntaxError: Unexpected token < in JSON at position 0`: Sometimes the request to the Subscan API fails, which could cause this issue. Try to run the script again. If the error persists, please file an issue.

# Donations
This tool is free and stays free to use. But if this tool is useful for you and you feel generous, feel free to donate :)
* KSM: `GEJonasUoJARPLqGijvA3M4LfuoQxFBZcwUPSNN7s3yRNNu`
* DOT: `13b1wQcZXhWYxjwY9jdJkyJZu5p9TwFEXZnSEBPhca9kaAUN`
