# Staking Rewards Collector & Tax Calculator

# Disclaimer
Everyone using this tool does so at his/her own risk. I do not guarantee that the data is valid and every user is responsible for double-checking the results of this tool. In addition, every user must do his/her own research about how stake rewards are taxable in his/her regulatory framework. **Note**: The current estimate of overall tax burden assumes that staking rewards are taxed as they are paid out into the account with the respective spot-price of the day. It is unclear, whether this is the right way to do it. In addition, note that you are relying on Subscan's API (for staking data) as well as CoinGecko's API (for price data).

# What does it do?
This program makes it easy to **look up the staking rewards** of an account. Additionally, the user can specify to also add daily prices (in various fiat currencies) as provided by the CoinGecko API. With that data, additional metrics such as the total value of the staking rewards (in Fiat) as well as a potential tax burden are calculated. The output is a .json File, which gives you all the information you need.

# How to install?

# How to use it?
## Input
When launching the program, you are asked to provide several **inputs**:
* Address: The Address you want to have the stake rewards parsed.
* Network: The network you want to analyze (allowed: 'polkadot' and 'kusama').
* Start (YYYY-MM-DD): The first day you want to analyze (Note that there are earliest days for chain data for polkadot 2020-08-19 and for kusama 2019-09-20).
* End (YYYY-MM-DD): The last day you want to analyze.
* Currency: In what currency you would like to have your value expressed (allowed: 'chf', 'usd', 'eur').
* IncomeTax: You can specify already your income Tax rate. If you don't know / care input e.g. 1 and ignore the output's taxableIncome.
* PriceData: To be answered with 'y' or 'n'. If the user specifies 'y', the tool tries to populate the staking rewards with the respective spot prices of that day.


## Output
If the script is successfully run, you can find an 'output.json' in your main folder. Insert that to e.g., http://jsonviewer.stack.hu/ to make it readable. The **output** contains:
* Some information of your inputs (address, network, income tax rate).
* A a sum of your total staked amount expressed in human readable format (i.e., in new DOT or KSM).
* If priceData was requested and income tax was specified: Overall tax burden.
* A list with objects containing more information about when rewards happened as well as block number and extrinisc hash. Every day in your specified range is one object. When there are several events within one day, strings are concanated and numbers are added.

# Important Notes:
* CoinGecko's API only allows for 100 requests per minute. That means, currently you a range of longer than 100 days will produce an error.
* If CoinGecko's API cannot provide daily prices (e.g., because there was no market yet), there will be an error.
