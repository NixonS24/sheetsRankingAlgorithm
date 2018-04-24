# Ranking Algorithm

Summary:

This program takes votes on American stocks, corresponds that to the risk-weighted return (sharpe-ratio) of the stock over the relevant time interval, and then generates a value which is used to rank the users.

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
