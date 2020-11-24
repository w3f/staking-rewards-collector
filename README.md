# Staking Rewards Collector & Tax Calculator

# Disclaimer
Everyone using this tool does so at his/her own risk. I do not guarantee that the data is valid and every user is responsible for double-checking the results of this tool. In addition, every user must do his/her own research about how stake rewards are taxable in his/her regulatory framework. 

**Note**: The current estimate of overall tax burden assumes that staking rewards are taxed as they are paid out into the account with the respective spot-price of the day. It is unclear, whether this is the right way to do it. In addition, note that you are relying on Subscan's API (for staking data) as well as CoinGecko's API (for price data).

# What does it do?
This program makes it easy to **look up the staking rewards** of an account. Additionally, the user can specify to also add daily prices (in various fiat currencies) as provided by the CoinGecko API. With that data, additional metrics such as the total value of the staking rewards (in Fiat) as well as a potential tax burden are calculated. The output is a .json File, which gives you all the information you need.

# How to run?
## Requirements:
* yarn: https://classic.yarnpkg.com/en/docs/install/

## Run
* git clone git@github.com:w3f/staking-rewards-collector.git
* cd staking-rewards-collector
* (optionally): change the parameters inside the userInput.json to your needs.
* yarn
* yarn start

# How to use it?
## Input
The program takes several inputs in the 'config/userInput.json' file.

Staking Rewards:
* **Address**: The Address you want to have the stake rewards parsed.
* **Network**: The network you want to analyze (allowed: "polkadot" and "kusama").
* **Start** (YYYY-MM-DD): The earliest day you want to analyze (Note that there are earliest days for chain data for polkadot 2020-08-19 and for kusama 2019-09-20).
* **End** (YYYY-MM-DD): The most recent day you want to analyze.
* **InitialInvestment**: To calculate your annualized return, specify how much tokens you bonded for staking. 

Price Data:
* **Currency**: In what currency you would like to have your value expressed (allowed: "chf", "usd", "eur").
* **IncomeTax**: Specify your individual income tax rate (e.g., 0.07 for 7%). This only gives a reasonable output if priceData is parsed. (allowed: numbers).
* **PriceData**: Do you want to look up price data for your specified range? (allowed: "y", "n"). **Note** if your specified time window exceeds 100 days the CoinGecko API will return an error.


## Output
If the script is successfully run, you can find an 'output.json' in your main folder. Copy the inside of that file and Insert that to e.g., http://jsonviewer.stack.hu/ (click at "format" after paste) to make it readable. Example output:

![]https://i.imgur.com/QwXEGIN.png


The **Output** contains:

### Header

* Some information of your inputs (address, network, income tax rate, currency, initialInvestment).
* **firstReward**: The day specified within your window you received your first reward.
* **lastReward**: The day specified within your window you received your last reward.
* **annualizedReturn**: The annualized return rate of your investment (if you provided a reasonable value for "initialInvestment"). The basis of this calculation is those days between "firstReward" and "lastReward". It is only reasonable if you did not change too much in your staking situation (like deposited, withdraw etc.).
* **currentValueRewardsFiat**: The amount of staking rewards priced at "start".
* **totalAmountHumanReadable**: The sum of staking rewards within your specified period in (new Dot or KSM).
* **totalValueFiat**: The value of the staking rewards **based on daily prices they were received**.
* **totalTaxBurden**: The "totalValueFiat" multiplied with your incomeTax rate.

### Data

* **numberRewardsParsed**: The number of found staking rewards.
* **numberOfDays**: The days between "start" and "end".

### List

A list with objects for every day in your specified range. In the price of numbers (e.g. "amountPlanks") multiple staking rewards are added. In the case of strings, those are concanated.

# Important Notes:
* CoinGecko's API only allows for 100 requests per minute. That means, currently you a range of longer than 100 days will produce an error.
* If CoinGecko's API cannot provide daily prices (e.g., because there was no market yet), there will be an error.
