//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
var rankingSheet = ss.getSheetByName('rankingTable');

function cohortAnalysis() {

  //test to see if CohortAnalysis sheet exists, if not create and formatted

  var userIDs = getUserIDs(); //get userIDs
  //Logger.log(userIDs);


  //var DatesAndVotesPerTotal = getDatesAndVotesPerTotal(userIDs);
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

//function getDatesAndVotesPerTotal(userIDs) {
  //var
//}

function testVariable() {
  array = [];
  testSheet = ss.getSheetByName('405');
  testSheetLastRow = testSheet.getLastRow() - 1;

  testSheetTargetValues = testSheet.getRange(2,1,testSheetLastRow, 1).getValues();

  for (var i = 1; i < testSheetTargetValues.length; i += 2) {
    array.push(testSheetTargetValues[i][0]);
  }
  Logger.log(array);
  //return here and r
  //return here and refactor.

  //New Function there
  array2 = [];
  for (var i = 0; i < array.length; i++) {
    switch(i){
      case 0:
        if (testSheetTargetValues[i] != 0) {
          array2.push("1");
          continue;
        } else {
          array2.push("0");
          continue;
        }
      default:
        if (testSheetTargetValues[i] - testSheetTargetValues[i - 1] != 0) {
          array2.push("1");
          continue;
        }
        else {
          array2.push("0");
          continue;
        }
    }
  }
  Logger.log(array2);


  //This should be refactored into a function at this point
}

function testVariable2() {

}
