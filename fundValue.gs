//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var rankingSheet = ss.getSheetByName('rankingTable');
var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
var companySheet = ss.getSheetByName('CompanySheet');
//This function takes an array of numbers corresponds them to votes and then allocates it to the correct stock sections and then logs change through the days

function fundValue() {

  var numericValueArray = [];
  getnumericValue(numericValueArray);

  var userVotes;
  getUserVotes(userVotes);

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

function getUserVotes(object) {
  object = userRankingsSheet.getRange(2,3,10,70).getValues();
  Logger.log(object);
  return object;
}


function numericValue(array) {

  var rankingTable = ss.getSheetByName('rankingTable');

  //Get powerVote number in an object
  var lastRow = rankingTable.getLastRow() - 2;
  var powerVote = rankingTable.getRange(3,4,lastRow,1).getValues();

  for (var i = 0; i < lastRow; i ++) {
    array.push(powerVote[i][0] * 100000 / lastRow);
    rankingTable.getRange(i + 3, 6).setValue(array[i]);
  }
  return array;
}
