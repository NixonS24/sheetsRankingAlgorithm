//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var userRankingsPullSheet = ss.getSheetByName("Users Rankings Pull");
var userRankingPullLastRow = userRankingsPullSheet.getLastRow();
var maxColumnsInUserRankingsSheet = userRankingsPullSheet.getMaxColumns();
var rankingSheet = ss.getSheetByName('rankingTable');
var rankingSheetLastRow = rankingSheet.getLastRow();

function createRanking () {

  var userID = getUserID();
  Logger.log(userID);

  createNewSheetIfDoesNotExist(userID);

  putVoteValuesIntoCorrespondingSheets(userID);

  setEngagmentValue(userID);

  createWeightedScore(userID);

  storePreviousDaysRanks();

  rankUser(userID);

  updatePreviousRankings();
}

function getUserID() {
  var userIDArray = [];
  var userIDObject = userRankingsPullSheet.getRange(2,1,userRankingPullLastRow - 1,1).getValues() //This is a depency, as we are assuming that userIDs start at row 2
  for (var i = 0; i < userIDObject.length; i ++) {
    userIDArray.push(userIDObject[i][0]);
  }
  return userIDArray;
}

function createNewSheetIfDoesNotExist(userID) {
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

function putVoteValuesIntoCorrespondingSheets(userID) {

  //Array for unit Testing
  //userID = [481,479,480];

  rowLocation = 2; //This is a way to keep correspond the UserID to the their row position, the ID commence at Row 2
  for (IDNumber in userID) {
    var tempSheet = ss.getSheetByName(userID[IDNumber]);
    var voteValues = userRankingsPullSheet.getRange(rowLocation, 1, 1, maxColumnsInUserRankingsSheet).getValues();
    voteValues[0].unshift(new Date());
    var lastRow = tempSheet.getLastRow() + 1;
    tempSheet.getRange(lastRow, 1, 1, voteValues[0].length).setValues(voteValues);
    tempSheet.getRange(lastRow + 1, 2).setValue(userID[IDNumber]);
    rowLocation ++;
    createRankingsValues(lastRow, tempSheet, voteValues); //fills the rankings column witht the appropriate measure
  }
}

function createRankingsValues(row, tempSheet, voteValues) {
  var betaRow = row + 1;
  for (var i = 0; i < voteValues[0].length; i++) {
    if (voteValues[0][i] == "0") {
      continue;
    }
    else if (voteValues[0][i] == "1" || voteValues[0][i] == "-1") {
      var betaCol = i + 1;
      var targetCell = tempSheet.getRange(betaRow, betaCol);
      targetCell.setValue(hLookupString(betaCol, tempSheet)); //this function brings in the BetaValue
    }
    else {
      continue;
    }
  }
}

function hLookupString(col, tempSheet) {
  var colAsLetter = columnToLetter(col,tempSheet); //converts column number to letter
  var lastColAsLetter = columnToLetter(userRankingsSheet.getLastColumn());
  var lastRow = ss.getSheetByName('CompanySheet').getLastRow();
  var maxRow = userRankingsSheet.getMaxRows();
  var hLookup = ('=HLOOKUP(' + colAsLetter + '1 , CompanySheet!A1:' + lastColAsLetter + maxRow + ',' + lastRow + ', FALSE)');
  return hLookup;
}

function setEngagmentValue(userID) {
  for (IDNumber in userID) {
    var tempSheet = ss.getSheetByName(userID[IDNumber]);
    var lastRow = tempSheet.getLastRow();
    tempSheet.getRange(lastRow, 1).setValue(engagementFunction(lastRow));
  }
}

function engagementFunction(lastRow) {
  var previousRow = lastRow - 1;
  var stringFormatted =  ('=(COUNT(D' + lastRow + ':DU' + lastRow + ')/COUNT(D' + previousRow + ':DU' + previousRow + '))');
  Logger.log(stringFormatted);
  return stringFormatted;
}

//adds a number of columns together and adds the total to the top left hand corner
function createWeightedScore(array) {

    for (name in array) {
      var tempSheet = ss.getSheetByName(array[name]);
      var lastRow = tempSheet.getLastRow();
      var lastColumn = tempSheet.getLastColumn();
      var rankingScore = 0;
      var numberOfVotes = 0;
      var scaledRankingScore;

    for (var i = lastRow; i > 2; i -= 2) {
      var sumRange = tempSheet.getRange(i, 1, 1, lastColumn).getValues();

      for (var t = 0; t < sumRange[0].length; t++) {
        if (sumRange[0][t] == "") {
          continue;
        }
        else if (sumRange[0][t] == "#ERROR!") {
          continue;
        }
        else if (sumRange[0][t] == "#N/A") {
          continue;
        }
        else {
          var vote = tempSheet.getRange(i - 1 , t + 1).getValue(); //to get the vote we need the row above and then the account for the difference in counting
          numberOfVotes += 1;

          if (vote == "1" && sumRange[0][t] > 0) {
            rankingScore += parseFloat(sumRange[0][t]);
            //'positive vote, positive movement
            continue;
          }
          else if (vote == '1' && sumRange[0][t] < 0) {
            rankingScore += parseFloat(sumRange[0][t]);
            //positive vote, negative movement
            continue;
          }
          else if (vote == "-1" && sumRange[0][t] > 0) {
            rankingScore += (parseFloat(sumRange[0][t]) * -1);
            continue;
            //negative vote, positive movement
          }
          else if (vote == '-1' && sumRange[0][t] < 0) {
            rankingScore += (parseFloat(sumRange[0][t]) * -1);
            continue;
            //negative vote, negative movenment
          }
          else {
            continue;
          }
        }
      }
    }
      scaledRankingScore = powerFunction(numberOfVotes) * rankingScore; //scales the rank depenent on the number of votes
      tempSheet.getRange(1,1).setValue(scaledRankingScore);
  }
}

//fits a number to a simple logorithmic distribution
function powerFunction(number) {
  return Math.log(number);
}

function storePreviousDaysRanks() {

  var dataRange = rankingSheet.getDataRange();
  var lastColumn = rankingSheet.getLastColumn();

  var previousRankingTable = ss.getSheetByName('previousRankingTable');

  if (rankingSheet == 'null') {
    return;
  }

  previousRankingTable.insertColumns(1,lastColumn + 2);
  dataRange.copyTo(previousRankingTable.getRange("A1"), SpreadsheetApp.CopyPasteType.PASTE_VALUES);
}

function rankUser(array) {
  rankingSheet.getDataRange().clear();
  for (name in array) {
   var tempSheet = ss.getSheetByName(array[name]);

   createBaseFormat();

   var userId = tempSheet.getRange(2,2).getValue();
   var userScore = tempSheet.getRange(1,1).getValue();
   var userName = tempSheet.getRange(2,3).getValue()
   var lastRow = rankingSheet.getLastRow() + 1;

   rankingSheet.getRange(lastRow,1).setValue(userId);
   rankingSheet.getRange(lastRow,2).setValue(userName);

   if (userScore == '#NUM!') {
     rankingSheet.getRange(lastRow,4).setValue('0');
    } else {
      rankingSheet.getRange(lastRow,4).setValue(userScore);
    }

  }
  rankString(); //ranks current days peformance
}

function createBaseFormat() {

  rankingSheet.getRange(1,1).setValue(new Date());
  var secondRowValues = [];
  secondRowValues[0] = 'user_id';
  secondRowValues[1] = 'full_name';
  secondRowValues[2] = 'rank';
  secondRowValues[3] = 'power_vote';
  secondRowValues[4] = 'rank_Status';
  secondRowValues[5] = 'fund_value';

  for (i = 0; i < secondRowValues.length; i++) {
    rankingSheet.getRange(2, i + 1).setValue(secondRowValues[i]);
  }
}

//creates a the Google Function Rank in column three of the sheet Ranking Table
function rankString() {

 var lastRowNumer = rankingSheet.getLastRow();

 for (var i = 2; i < lastRowNumer; i ++) {
   var sheetPosition = i + 1;
   var name = ('=RANK(D'+ sheetPosition + ', D1:D' + lastRowNumer + ')');
   rankingSheet.getRange(sheetPosition, 3).setValue(name);
 }

}

//Update PreviousDaysRankings
function updatePreviousRankings() {

  var rankingMovement = []
  compareScores(rankingMovement); //creates of rankingmovement scores

  var binaryTransfo = makeBinary(rankingMovement); //just conform it to -1 and positive 1 so it is intereacts more easily with system
  //This can potential be refactored out if we want the whole number
  var rankingSheet = ss.getSheetByName('rankingTable');
  var rankStatusColumn = 5;

  for (i = 0; i < binaryTransfo.length; i ++) {
    rankingSheet.getRange(i + 3 , rankStatusColumn).setValue(binaryTransfo[i]);
  }
}

//Compares two columns in two different Javasciript Object, then subtract the second third columns from each other
function compareScores(array) {

  //Necessary declaration to target the Current Rankings
  var lastRow1 = rankingSheet.getLastRow() - 2;
  var currentRankingValues = rankingSheet.getRange(3,1,lastRow1,3).getValues();

  //Necessary delclaration to target Previous Rankings
  var previousRankingSheet = ss.getSheetByName('previousRankingTable');
  var lastRow2 = previousRankingSheet.getLastRow() - 2;
  var previousRankingValues = previousRankingSheet.getRange(3,1,lastRow2,3).getValues();

  for (i = 0; i < lastRow1; i++) {
   for (j = 0; j < lastRow2; j ++) {
     if (currentRankingValues[i][0] == previousRankingValues[j][0]) {
       var temp = parseInt(previousRankingValues[j][2]) - parseInt(currentRankingValues[i][2]);
       array.push(temp);
       break;
     }
     if (j == lastRow2 - 1) {
       array.push('0'); //push 0 into correct place,
     }
   }
 }
 return array;
}

//takes a range of numbers and turns them into 1,0,-1
function makeBinary(array) {

  var newArray = [];
  for (i = 0; i < array.length; i ++) {
    if (array[i] >= 1) {
      newArray.push('1');
      continue;
    }
    if (array[i] <= -1){
      newArray.push('-1');
      continue;
    }
    else {
      newArray.push('0');
      continue;
    }
  }
  return newArray;
}

//Converts a columnNumber to its corresponding Letter
function columnToLetter(column) {
 var temp, letter = '';
 while (column > 0)
 {
   temp = (column - 1) % 26;
   letter = String.fromCharCode(temp + 65) + letter;
   column = (column - temp - 1) / 26;
 }
 return letter;
}
