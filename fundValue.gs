//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var rankingSheet = ss.getSheetByName('rankingTable');
var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
var companySheet = ss.getSheetByName('CompanySheet');
var tickerRow = 5;
//This function takes an array of numbers corresponds them to votes and then allocates it to the correct stock sections and then logs change through the days

function fundValue() {


  var userFundAllocation = makeUserFundAllocation(); //creates an array which states how much of the fund a user gets influence over
  //Logger.log(userFundAllocation)

  var userVotes = getUserVotes(); //gets an object which stores the total amount of userVotes made in a period.
  Logger.log(userVotes);

  var totalVotesPerUser = calculateTotalVotesPerUser(userVotes) //Calculates the total number of votes made by a user in absolute terms
  //Logger.log(totalVotesPerUser);

  //NOTE: with this function array[0] = unallocatedFunds, array[1]-[n] = userFundAllocationPerIndividualStock
  var userFundAllocationPerIndividual = makeUserFundAllocationPerIndividualStock(totalVotesPerUser,userFundAllocation);
  //Logger.log(userFundAllocationPerIndividual);

  var unallocatedFunds = userFundAllocationPerIndividual[0];
  userFundAllocationPerIndividual.splice(0,1); //removes first value, which is the unallocatedFunds
  Logger.log(userFundAllocationPerIndividual);

  setUnallocatedFunds(unallocatedFunds);

  setAllocatedFunds(userFundAllocationPerIndividual, userVotes);
  //writeMonetaryValue(userFundAllocation,totalVotesPerUser,userVotes)

  //get object of all the votes for that days
  //Sum all the corresponding row to get total votes cast
  //Need to put in case if 0, not sure what yet
  //Need to then dump into the corresponding company in company sheets
  //Should be added if cell is not null
  //Then need to figure out how this is going to intereact wiht market data
  //this should be summed somwhere and then added back
  //Also need to figure out how this is going to interact with market changes,
  //potential I make be able to format a http request or copy values from current table.
}

function setAllocatedFunds(userFundAllocationPerIndividual, userVotes) {

  var buyStock = [];
  var sellStock = [];

  for (var i = 0; i < userFundAllocationPerIndividual[0].length; i++) {
    if (userFundAllocationPerIndividual[0][i] == "0") {
      Logger.log('checkibng break one');
      continue;
    }
    else {
        for (j = 0; j < userVotes[i].length; j++) {
          //Logger.log(userVotes[k][j]);
          if (userVotes[i][j] == "0") {
            continue;
          }
          else if (userVotes[i][j] == "1") {
           var temp = companySheet.getRange(tickerRow + 4, j + 2).getValue();
           temp += parseFloat(userFundAllocationPerIndividual[0][i]);
           companySheet.getRange(tickerRow + 4, j + 2).setValue(temp);
            // Logger.log(j);
            // Logger.log(userFundAllocationPerIndividual[0][i]);
            continue;

          }
          else if (userVotes[i][j] == "-1") {
            var temp = companySheet.getRange(tickerRow + 5, j + 2).getValue();
            temp += parseFloat(userFundAllocationPerIndividual[0][i]);
            companySheet.getRange(tickerRow + 5, j + 2).setValue(temp);
            // Logger.log(j);
            // Logger.log(userFundAllocationPerIndividual[0][i]);
            continue;
          }
          else {
            continue;
          }
        }
    }
  }
}

function setUnallocatedFunds(unallocatedFunds) {
  var lastColumn = companySheet.getLastColumn();
  var companyMarketCapPercent = companySheet.getRange(tickerRow + 2, 2, 1, lastColumn - 1).getValues();

  for (var i = 0; i < companyMarketCapPercent[0].length; i ++) {
    var columnPosition = i + 2;
    companySheet.getRange(tickerRow + 4, columnPosition).setValue(companyMarketCapPercent[0][i] * unallocatedFunds);
  }
}

function makeUserFundAllocationPerIndividualStock(totalVotesPerUser, userFundAllocation) {
  var userFundAllocationPerIndividualStock = [];
  var unallocatedFunds = 0;
  var noVotesCast = "0.0";

  for (i = 0; i < totalVotesPerUser.length; i++) {
    if (totalVotesPerUser[i] == noVotesCast) {
      userFundAllocationPerIndividualStock.push("0");
      unallocatedFunds += userFundAllocation[i];
      continue;
    }
    userFundAllocationPerIndividualStock.push(userFundAllocation[i] / totalVotesPerUser[i]);
  }
  //Logger.log(userFundAllocationPerIndividualStock)
  //Logger.log(unallocatedFunds);
  return [unallocatedFunds, userFundAllocationPerIndividualStock];

}


function calculateTotalVotesPerUser(object) {

  var array = [];

  for (var i = 0; i < object.length; i ++) {
    sum = 0;
   for (var j = 0; j < object[0].length; j++) {
     if (object[i][j] == "-1") {
       sum += (parseInt(object[i][j])* -1)
     }
     else if (object[i][j] == "1") {
       sum += parseInt(object[i][j])
     }
     else {
       continue;
     }
    }
    array.push(sum);
  }
  //Logger.log(array);
  return array;

}

function getUserVotes() {
  var lastColumn = userRankingsSheet.getLastColumn() - 2;
  var lastRow = userRankingsSheet.getLastRow() - 1;
  var object = userRankingsSheet.getRange(2,3,lastRow,lastColumn).getValues();
  return object;
}



function makeUserFundAllocation() {

  var array = [];

  var rankingTable = ss.getSheetByName('rankingTable');

  //Get powerVote number in an object
  var lastRow = rankingTable.getLastRow() - 1;
  var powerVote = rankingTable.getRange(3,4,lastRow,1).getValues();

  for (var i = 0; i < lastRow - 1; i ++) {
    array.push(powerVote[i][0] * 100000 / lastRow);
    rankingTable.getRange(i + 3, 6).setValue(array[i]);
  }
  return array;
}
