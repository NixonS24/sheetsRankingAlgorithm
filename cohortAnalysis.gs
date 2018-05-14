//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
var rankingSheet = ss.getSheetByName('rankingTable');

function cohortAnalysis() {
  var userIDs = getUserIDs();
  //Logger.log(userIDs);

  var DatesAndVotesPerTotal = getDatesAndVotesPerTotal(userIDs);
}

function getUserIDs() {
  var userIDs = [];
  var lastRow = userRankingsSheet.getLastRow();
  var userRowRange = lastRow - 1;
  var userIDObject = userRankingsSheet.getRange(2,1,userRowRange,1).getValues();

  for (var i = 0; i < userIDObject.length; i++) {
    userIDs.push(userIDObject[i][0]);
  }
  return userIDs;
}

function getDatesAndVotesPerTotal(userIDs) {
  var 
}
