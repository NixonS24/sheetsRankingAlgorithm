# Ranking Algorithm

This project is a Google Script Program that converts user votes (ether up/down) into an allocation of a fund, based upon the past accuracy of there votes.

# Getting Started

These instructions will get a copy of the project running on you local machine for development and testing purposes. As of yet this project has not been configured to work in a live system (because it will have to rebuilt)

# Prerequisites

There are no packages that need to be installed locally to make this project work. There are however a number of sheets that need to be formatted for this project to work correctly. My aim is to created this base templates for download (in the future) but in the interim I will provide a description.

You need two formatted sheets:

1) companySheet:
      Row 5, Cell 2 - list of Company Tickers

2) UserRankingPull:
      Row 1 - "UserID", "Full Name", then list of Company Names in corresponding order to Company Sheet
      Row 2 - UserId, Full Name, list of votes (1 = up, -1 = down, 0 = null)


# Summary:

This program takes votes on American stocks, corresponds that to the risk-weighted return (sharpe-ratio) of the stock over the relevant time interval, and then generates a value which is used to rank the users.

The run order of the program is the following:

1) performanceAttribution.gs - Updates the Sharpe Ratios, and company Sheet
2) Alog.gs - Corresponds Votes to Sharpe Ratio and then creates/updates rankings
3) StrategicTile.gs - Puts the total score of each user into a normal distribution then updates the table.
4) PriceChange.gs - Updates change in price for days movements
5) fundValue.gs - Allocates each individual portfolio funding based on past decisions, and then puts there votes into
6) FundValueFotmattingCSV.gs - creates spreadsheet to be imported.
7) userIndividualPerformance.gs - creates individual performance, and alpha generation.

Key Components:

performanceAttribution.gs

Links into a sheet called Company Sheet which contains all the Stock we want to get figures for in Row 1, and the live market figures in Row 2. This is using a Plug In "Intrinio - Financial Data" because we have not been able to get the API working directly into Intinio in scirpt form.

Specifications:
Gets Company names:
Creates Sheets if they do not already exist:
Puts the current figures into there corresponding sheets, and updates standard deviation, risk free and sharpe ratio.
Pulls all the sharpe ratios back into the company sheet.


algo.gs

Main formula:

Takes array of userNames, creates different useCases
Creates sheet of users if one does not exist.
Put the votes into correct Spreadsheet
corresponds the votes to there corresponding sharpe ratio.
Looks at whether vote is up or down and then adds or minuses score.
Adds up total number of votes that have been casted and then uses that to scale the userScore (assumptions is that the more votes greater accuracy the dataset)
Puts that into rankingSheet, and then ranks the users dependent upon that score.
Looks at previous results, and calculates change in ranks.


strageticTile.gs

This looks at the ranking score, puts it into a normal distribution and the allocate a number of votes that sum to the amount of users. This is bounded by on the negative by 0, and positive side by amount of users.

In future will backtest this distribution, to determine what is most effective in maximising returns. Early conjecture indicates that it is more likely to be Lotka's Law (fat start narrow tail).
