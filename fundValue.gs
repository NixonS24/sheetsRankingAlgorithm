//Global Declarations and dependcies
var ss = SpreadsheetApp.getActiveSpreadsheet();
var rankingSheet = ss.getSheetByName('rankingTable');
var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
var companySheet = ss.getSheetByName('CompanySheet');
var tickerRow = 5;
//This function takes an array of numbers corresponds them to votes and then allocates it to the correct stock sections and then logs change through the days

function fundValue() {

  var userFundAllocation = makeUserFundAllocation(); //creates an array which states how much of the fund a user gets influence over
  //Logger.log(userFundAllocation)

  var userVotes = getUserVotes2(); //gets an object which stores the total amount of userVotes made in a period.
  //Logger.log(userVotes);

  var totalVotesPerUser = calculateTotalVotesPerUser(userVotes) //Calculates the total number of votes made by a user in absolute terms
  //Logger.log(totalVotesPerUser);

  //NOTE: with this function array[0] = unallocatedFunds, array[1]-[n] = userFundAllocationPerIndividualStock
  var userFundAllocationPerIndividual = makeUserFundAllocationPerIndividualStock(totalVotesPerUser,userFundAllocation);
  //Logger.log(userFundAllocationPerIndividual);

  var unallocatedFunds = userFundAllocationPerIndividual[0];
  userFundAllocationPerIndividual.splice(0,1); //removes first value, which is the unallocatedFunds
  //Logger.log(userFundAllocationPerIndividual);
  //Logger.log(unallocatedFunds);

  clearExistingFundAllocation();

  setUnallocatedFunds(unallocatedFunds);

  setAllocatedFunds(userFundAllocationPerIndividual, userVotes);
}

function makeUserFundAllocation() {

  var array = [];
  var updatedFundValue = ss.getSheetByName('Fund Value FormattingCSV').getRange(1,2).getValue();
  //Logger.log(updatedFundValue);
  var rankingTable = ss.getSheetByName('rankingTable');

  //Get powerVote number in an object
  var lastRow = rankingTable.getLastRow() - 2;
  //Logger.log(lastRow)
  var powerVote = rankingTable.getRange(3,4,lastRow,1).getValues();

  for (var i = 0; i < lastRow; i ++) {
    array.push(powerVote[i][0] * updatedFundValue / lastRow);
    rankingTable.getRange(i + 3, 6).setValue(array[i]);
  }
  return array;
}

function getUserVotes2() {
  var lastColumn = userRankingsSheet.getLastColumn() - 2;
  //Logger.log(lastColumn)
  var lastRow = userRankingsSheet.getLastRow() - 1;
  //Logger.log(lastRow)
  var object = userRankingsSheet.getRange(2,3,lastRow,lastColumn).getValues();
  //var object = userRankingsSheet.getRange(2,3,25,100).getValues();
  return object;
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

function makeUserFundAllocationPerIndividualStock(totalVotesPerUser, userFundAllocation) {
  //Logger.log(totalVotesPerUser);
  //Logger.log(userFundAllocation);

  var userFundAllocationPerIndividualStock = [];
  var unallocatedFunds = 0;
  var noVotesCast = "0.0";

  for (i = 0; i < totalVotesPerUser.length; i++) {
    if (totalVotesPerUser[i] == noVotesCast) {
      userFundAllocationPerIndividualStock.push("0");
      unallocatedFunds += userFundAllocation[i];
      continue;
    } else {
    userFundAllocationPerIndividualStock.push(userFundAllocation[i] / totalVotesPerUser[i]);
    }
  }
  //Logger.log(userFundAllocationPerIndividualStock)
  //Logger.log(unallocatedFunds);
  return [unallocatedFunds, userFundAllocationPerIndividualStock];

}

function clearExistingFundAllocation() {
  var lastColumn = companySheet.getLastColumn();
  companySheet.getRange(tickerRow + 4 , 2 , 2, lastColumn - 1).clear({contentsOnly: true});
}

function setUnallocatedFunds(unallocatedFunds) {
  //Logger.log(unallocatedFunds)
  var lastColumn = companySheet.getLastColumn();
  var companyMarketCapPercent = companySheet.getRange(tickerRow + 2, 2, 1, lastColumn - 1).getValues();

  for (var i = 0; i < companyMarketCapPercent[0].length; i ++) {
    var columnPosition = i + 2;
    companySheet.getRange(tickerRow + 4, columnPosition).setValue(companyMarketCapPercent[0][i] * unallocatedFunds);
  }
}

function setAllocatedFunds(userFundAllocationPerIndividual, userVotes) {

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
