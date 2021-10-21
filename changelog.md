# Changelog
## Version 1.4.6
* Upgraded to new Subscan API standard.
* Added a small delay to avoid triggering API rate limit
## Version 1.4.5
* Added sum of fiat value in console output (based on daily prices).
## Version 1.4.4
* Fix: Slashes are not collected anymore.
## Version 1.4.3
* Subscan's API occasionally returns gibberish, added a loop to try again in such a case to improve UX.
* Output files will now not be written for accounts that did not receive rewards.
## Version 1.4.2
* Added more info on which address did never receive any staking rewards.
* Script does not terminate if one address did not receive any rewards.
* Removed Tax variables.
## Version 1.4.1
* Added link to a tutorial to the README.
* Script now does not terminate if one of the addresses did not receive any rewards in the specified time period.
* Coingecko provides fiat prices with many decimals, which is not sensible to use in the output files. Fiat price of tokens will now be rounded to two decimals.
* Changed `priceData` flag to `true` and `false` for consistency.
* Changed `initialInvestment` to `startBalance` to more accurately reflect the meaning.
## Version 1.4
Huge QoL improvement!
* Specify as many addresses as you want in the userInput.json.
* You can now also give your addresses a name.
* Removed network-specifier. The script now automatically detects which network the address is from (for Kusama/Polkadot).
* Added `exportOutput`: You can now specify if the output files should be generated or if you wish to just see your total staked amount in the terminal.

## Version 1.3
* Updated the API call such which gathers all price data with a single call. This significantly improves runtime and avoids throttle issues.
* Removed some rounding for non-Fiat values to give a accurate result.
* Fixed a bug where the USD price was used instead of other currencies.
* There is a very rare error when trying to parse the `stakingObject`. This resolves by simply running the script again. Added a note to ask the user to run the script again.
   
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
