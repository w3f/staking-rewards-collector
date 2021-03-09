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
