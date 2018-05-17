
function userIndividualPerformance() {
  //Global Declarations and dependcies
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rankingSheet = ss.getSheetByName('rankingTable');
  var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
  var companySheet = ss.getSheetByName('CompanySheet');
  var tickerRow = 5;


  var userFundAllocation = getUserFundAllocation();
  Logger.log(userFundAllocation.length);

  var userVotes = getUserVotes();
  Logger.log(userVotes.length);

  var userIDs = getUserIDs();
  Logger.log(userIDs.length);

  var totalVotesPerUser = calculateTotalVotesPerUser(userVotes);
  Logger.log(totalVotesPerUser.length);

  //NOTE: with this function array[0] = unallocatedFunds, array[1]-[n] = userFundAllocationPerIndividualStock
  var userFundAllocationPerIndividual = makeUserFundAllocationPerIndividualStock(totalVotesPerUser,userFundAllocation);
  //Logger.log(userFundAllocationPerIndividual);

  var unallocatedFunds = userFundAllocationPerIndividual[0];
  userFundAllocationPerIndividual.splice(0,1); //removes first value, which is the unallocatedFunds
  //Logger.log(userFundAllocationPerIndividual);
  //Logger.log(unallocatedFunds);

  var percetangeChangePerUser = makeAllocatedFunds(userFundAllocationPerIndividual, userVotes);
  Logger.log(percetangeChangePerUser);
  Logger.log(percetangeChangePerUser.length);


  //Functions

  function getUserFundAllocation() {
    var userFundAllocation = [];
    var lastRow = rankingSheet.getLastRow() - 1;
    var userFundObject = rankingSheet.getRange(3,6,lastRow - 1,1).getValues() //This is a depency, as we are assuming that userIDs start at row 2
    for (var i = 0; i < userFundObject.length; i ++) {
      userFundAllocation.push(userFundObject[i][0]);
    }
    return userFundAllocation;
  }

  function getUserVotes() {
    var lastColumn = userRankingsSheet.getLastColumn() - 2;
    //Logger.log(lastColumn)
    var lastRow = userRankingsSheet.getLastRow() - 1;
    //Logger.log(lastRow)
    var object = userRankingsSheet.getRange(2,3,lastRow,lastColumn).getValues();
    //var object = userRankingsSheet.getRange(2,3,25,100).getValues();
    return object;
  }

  function getUserIDs() {
    var userIDArray = [];
    var userIDObject = userRankingsPullSheet.getRange(2,1,userRankingPullLastRow - 1,1).getValues() //This is a depency, as we are assuming that userIDs start at row 2
    for (var i = 0; i < userIDObject.length; i ++) {
      userIDArray.push(userIDObject[i][0]);
    }
    return userIDArray;
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

  function makeAllocatedFunds(userFundAllocationPerIndividual, userVotes) {
    //Logger.log(userFundAllocationPerIndividual);
    var percentageChangeUser = [];

    for (var i = 0; i < userFundAllocationPerIndividual[0].length; i++) {
      var temp = [];
      if (userFundAllocationPerIndividual[0][i] == "0") {
        percentageChangeUser.push('0');
        continue;
      }
      else {
          for (j = 0; j < userVotes[i].length; j++) {
            //Logger.log(userVotes[k][j]);
            if (j == (parseFloat(userVotes[i].length) - 1)) {
                var addingAllPercentageChange = 0;
              for (t = 0; t < temp.length; t++) {
                addingAllPercentageChange += temp[t];
              }
               percentageChangeUser.push(addingAllPercentageChange);
                Logger.log(addingAllPercentageChange + ' addingallpercetangechange');
            }
            else if (userVotes[i][j] == "0") {
              continue;
            }
            else if (userVotes[i][j] == "1") {
             var stockChange = companySheet.getRange(tickerRow - 2 , j + 2).getValue();
             Logger.log(stockChange + ' stockChange');
             var performanceFigure = parseFloat(userFundAllocationPerIndividual[0][i]) * parseFloat(stockChange);
             Logger.log(performanceFigure + ' performanceFigure');
             temp.push(performanceFigure);
              Logger.log(temp + ' temp');
              // Logger.log(j);
              // Logger.log(userFundAllocationPerIndividual[0][i]);
              continue;

            }
            else if (userVotes[i][j] == "-1") {
              var stockChange = companySheet.getRange(tickerRow - 2 , j + 2).getValue();
              var performanceFigure = parseFloat(userFundAllocationPerIndividual[0][i]) * parseFloat(stockChange) * -1;
              temp.push(performanceFigure);
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
    return percentageChangeUser;
  }
}
