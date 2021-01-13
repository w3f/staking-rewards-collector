# Staking Rewards Collector v1.3

# Disclaimer
Everyone using this tool does so at his/her own risk. Neither I nor Web3 Foundation guarantee that any data collected is valid and every user is responsible for double-checking the results of this tool. In addition to potential bugs in this code, you are relying on third-party data: Subscan's API is used to collect staking data and CoinGecko's API is used to collect daily price data.

**This is no tax advice**: Every user is responsible to do his/her own research about how stake rewards are taxable in his/her regulatory framework. 

# Changelog
## Version 1.3
* Updated the API call such which gathers all price data with a single call. This significantly improves runtime and avoids throttle issues!
   
## Version 1.21
* Added GBP currency support.
* Included daily volume in output files.

## Version 1.2
* Removed the restriction that priceData must be available for all days within the specified time window. Now the user can request price data for any time period and the script will only populate prices where it is available and return a price of 0 where it is not.
* Bugfix: There was another case (accounts with many payouts), where the loop prematurely ended and did not show all staking rewards.
* Bugfix: There was one more day available of priceData from CoinGecko. This day is now included.
* CoinGecko's support told me that the *actual* request limit is 60/minute. I adjusted the parameters, which hopefully fixes request limit throttles.
* Included an info text how many requests are left and approx. runtime of the script.
* Adjusted `README.md` to illustrate the changes of v1.2.

## Version 1.1
* Bugfix: In some special combinations of `start`and `end`and paid rewards, it could lead to a premature termination of the addStakingData loop and not finding rewards.
* Bugfix: The script would parse one day less than in `end` specified. 
* CoinGecko limits API requests to 100 per minute. In some cases it seems that even waiting 80 seconds is not enough and the API returns a throttle warning. To counter this issue, a new variable `sleepTimer` is added to `config/userInput.json`. It specifies how long (in seconds) the script should idle before making an new request.
* Added suggestion to increase `sleepTime` if user experiences throttled API requests.
* Updated `README.md` to incorporate these changes and added a troubleshooting section.


# What can it do?
* Collect staking rewards for a given public address (either Polkadot or Kusama) for a user-specified time window. The tool calculates the sum of staking rewards within that period.
* If the time window allows it (check below some requirements for `start` and `end` date), it also collects daily price data and the fiat value of a stake reward given that day's spot price.
* If a meaningful income tax parameter is provided, it can help to estimate your potential tax burden.
* If a meaningful initial investment (in DOT or KSM) is provided, it can calculate the annualized return rate (extrapolated from your time window to one year).
* The output is stored in table format as CSV file and as JSON object (with more detailed information). For easier processing of multiple addresses, the file names also contain the address.

# How to run?
## Requirements:
* yarn: https://classic.yarnpkg.com/en/docs/install/
* node: 12.20.0 -> there might be a syntax error if run with older versions of nodejs

```bash
git clone git@github.com:w3f/staking-rewards-collector.git
cd staking-rewards-collector
Change the parameters inside the config/userInput.json to your needs.
yarn
yarn start
```

# How to use it?
## Input
The program takes several inputs in the `config/userInput.json` file.

Staking Rewards:
* **address**: The Address you want to have the stake rewards parsed.
* **network**: The network you want to analyze (allowed: "polkadot" and "kusama").
* **start** (YYYY-MM-DD): The earliest day you want to analyze. Note that the earliest available prices for Polkadot are 2020-08-19 and 2019-09-20 for Kusama and that prices are set to 0 before that.
* **end** (YYYY-MM-DD): The most recent day you want to analyze.
* **initialInvestment**: The amount of tokens from which the staking rewards are generated. Used to calculate the annualizedReturn. 

Price Data:
* **currency**: In what currency you would like to have your value expressed (allowed: "CHF", "USD", "EUR", "GBP").
* **incomeTax**: Specify your individual income tax rate (e.g., 0.07 for 7%). This only gives a reasonable output if priceData is parsed. (allowed: numbers).
* **priceData**: Do you want to look up price data for your specified range? (allowed: "y", "n").


## Output
After the tool executed successfully, it creates two files in the root folder. The JSON file contains some meta-data (e.g., sum of rewards and estimate of annualized return rate) and the CSV file gives the most important information in a table and thereby printable format. 

### CSV Output
The CSV output file contains a row for every day within the time frame where at least one staking reward occured. Other days are excluded. Example output:

https://i.imgur.com/4LCsDOc.png


### JSON Output
The JSON output file contains a summary of the data as well as a list of objects for every day of the specified time-period (regardless of whether staking rewards occured). If your standard OS text editor does not format the file properly, you can copy the data and insert it to http://jsonviewer.stack.hu/ (click at "format" after paste). Example output:

https://i.imgur.com/QwXEGIN.png

The **JSON Output** contains:

### Summary

* Some information of your inputs (address, network, incomeTax, currency, initialInvestment).
* **firstReward**: The day specified within your window you received your first reward.
* **lastReward**: The day specified within your window you received your last reward.
* **annualizedReturn**: The annualized return rate of your investment (if you provided a reasonable value for `initialInvestment`). The basis of this calculation is those days between `firstReward` and `lastReward`. It is only reasonable if you did not change too much in your staking situation (like deposited, withdraw etc.).
* **currentValueRewardsFiat**: The current value of the staking rewards (at the most recent daily price specified by your time window).
* **totalAmountHumanReadable**: The sum of staking rewards within your specified period in (new DOT or KSM).
* **totalValueFiat**: The value of the staking rewards **based on daily prices they were received**.
* **totalTaxBurden**: The `totalValueFiat` multiplied with your `incomeTax` rate.

### Additional Data

* **numberRewardsParsed**: The number of found staking rewards.
* **numberOfDays**: The days between `start` and `end`.

### List of objects

A list with objects for every day in your specified range. In the price of numbers (e.g. `amountPlank`) multiple staking rewards are added. In the case of strings, those are concanated.

# Troubleshooting
* `SyntaxError: Unexpected token < in JSON at position 0`: Sometimes the request to the Subscan API fails, which could cause this issue. Try to run the script again. If the error persists, please file an issue.

