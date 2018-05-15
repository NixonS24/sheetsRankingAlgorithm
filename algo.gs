//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var userRankingsPullSheet = ss.getSheetByName("Users Rankings Pull");
var userRankingPullLastRow = userRankingsPullSheet.getLastRow();
var rankingSheet = ss.getSheetByName('rankingTable');
var rankingSheetLastRow = rankingSheet.getLastRow();


function createRanking () {

  var userID = getUserID();
  Logger.log(userID);

  createNewSheetIfDoesNotExist(userID);
}


function getUserID() {
  var userIDArray = [];
  var userIDObject = userRankingsPullSheet.getRange(2,1,userRankingPullLastRow - 1,1).getValues() //This is a depency, as we are assuming that userIDs start at row 2
  for (var i = 0; i < userIDObject.length; i ++) {
    userIDArray.push(userIDObject[i][0]);
  }
  return userIDArray;
}

//this could be refactored to query sheets name directly (ss.getSheets().getName) but is more efficient to use already cleaned data
function createNewSheetIfDoesNotExist(userID) {
  var maxColumnsInUserRankingsSheet = userRankingsPullSheet.getMaxColumns();
  var companyNames = userRankingsPullSheet.getRange(1,1,1,maxColumnsInUserRankingsSheet).getValues();
  for (IDNumber in userID) {
    var tempSheet = ss.getSheetByName(userID[IDNumber]);
    if (tempSheet == null) {
      ss.insertSheet().setName(userID[IDNumber]).deleteRows(100,900);
      var tempSheet = ss.getSheetByName(userID[IDNumber]);
      tempSheet.getRange(1,2,1,companyNames[0].length).setValues(companyNames);
      continue;
    } else {
      continue;
    }
  }
}

// function getNameOfSheets() {
//   var nameOfSheetsArray = [];
//   var nameOfSheetsObject = ss.getSheets();
//
//   for (var i = 0; i < nameOfSheetsObject.length; i++) {
//     var temp = ss.getSheets()[i].getName();
//     if (isNaN(parseInt(temp))) {
//       continue;
//     }
//     else {
//       nameOfSheetsArray.push(temp);
//       continue;
//     }
//   }
//   return nameOfSheetsArray;
// }
