//creates the number of votes per user depending on number of users, and performance

//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var rankingTable = ss.getSheetByName("rankingTable");


function createStrategicTile() {

  var getScoreArray = [];
  getScore(getScoreArray);
  Logger.log(getScoreArray);
}

function getScore(array) {

  var lastRow = rankingTable.getLastRow();
  var values = rankingTable.getRange(1,2,lastRow,1).getValues();

  for (var i = 0; i < values.length; i++) {
    array.push(values[i][0]);
  }
  return array;
}



//var numberOfUSer = count number of users
//find means of the data
//find standard devation of the data

//standardise the data - (value - mean)/ standard deviation

//increase the values of the figure by the value of the lowest figure.
//Sum that figure = aAUC


//voting power = numberOfUers/aAUC * individual standardised data
