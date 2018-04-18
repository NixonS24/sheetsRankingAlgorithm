//creates the number of votes per user depending on number of users, and performance

//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var rankingTable = ss.getSheetByName("rankingTable");


function createStrategicTile() {

  var getScoreArray = [];
  getScore(getScoreArray);
  var duplicateGetScoreArray = getScoreArray.slice()

  var mean = getAverage(getScoreArray); //get the mean of the data

  var standardDeviation = getStandardDeviation(duplicateGetScoreArray); //get the standard deviation of the data

  var normalDistribution = standardise(duplicateGetScoreArray, mean, standardDeviation);
  Logger.log(normalDistribution);
}

function standardise(array, mean, stDEV) {

  var standardiseFigures = [];
  for (var i = 0; i < array.length; i ++) {
    var temp = (array[i] - mean)/stDEV;
    standardiseFigures.push(temp);
  }
  return standardiseFigures;
}

//get average of an array, need to deal with boolean here as not processing currently
function getStandardDeviation(values){
  var avg = getAverage(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = getAverage(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function getAverage(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

//get all the values in column 3, and puts them into an array
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
