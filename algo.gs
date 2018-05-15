//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var userRankingsPull = ss.getSheetByName("Users Rankings Pull");
var userRankingPullLastRow = userRankingsPull.getLastRow();
var rankingSheet = ss.getSheetByName('rankingTable');
var rankingSheetLastRow = rankingSheet.getLastRow();


function createRanking () {
  var nameOfSheets = getNameOfSheets();
  Logger.log(nameOfSheets);

  var userID = getUserID();
  Logger.log(userID);

  //var IDsThatDontHaveASheet = removeIdsThatHaveASheet
}

function getNameOfSheets() {
  var nameOfSheetsArray = [];
  var nameOfSheetsObject = ss.getSheets();

  for (var i = 0; i < nameOfSheetsObject.length; i++) {
    var temp = ss.getSheets()[i].getName();
    if (parseInt(temp) == NaN) {
      continue;
    }
    else {
      nameOfSheetsArray.push(temp);
      continue;
    }
  }
  return nameOfSheetsArray;
}

function getUserID() {
  var userIDArray = [];
  var userIDObject = userRankingsPull.getRange(2,1,userRankingPullLastRow - 1,1).getValues() //This is a depency, as we are assuming that userIDs start at row 2

  for (var i = 0; i < userIDObject.length; i ++) {
    userIDArray.push(userIDObject[i][0]);
  }
  return userIDArray;
}
