//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var rankingTable = ss.getSheetByName("rankingTable");

//This function takes a list of values corresponding to user performance and normalaises them, and retunrs there corresponding voting power (bounded by 0)
function createStrategicTile() {

  var getScoreArray = [];
  getScore(getScoreArray);

  var duplicateGetScoreArray = getScoreArray.slice()
  //Logger.log(getScoreArray);

  var mean = getAverage(getScoreArray); //get the mean of the data
  //Logger.log(mean)

  var standardDeviation = getStandardDeviation(duplicateGetScoreArray); //get the standard deviation of the data
  //Logger.log(standardDeviation)

  var normalDistribution = standardise(duplicateGetScoreArray, mean, standardDeviation); //standardised the distribution to standardised normal
  //Logger.log(normalDistribution)

  var positiveBounds = getPositiveBounds(normalDistribution); //increase the values in the array to be bounded by negative 0 - this is mathmatically unsound but quick for MVP
  //Logger.log(positiveBounds)

  var votingPower = getVotingPower(positiveBounds); //determins the number of votes each user should have
  //Logger.log(votingPower)

  writeValues(votingPower); //write the values into column next to user

}

//get all the values in column 3, and puts them into an array
function getScore(array) {

  var lastRow = rankingTable.getLastRow() - 2;

  var values = rankingTable.getRange(3,4,lastRow).getValues();

  for (var i = 0; i < values.length; i++) {
    array.push(values[i][0]);
  }
  return array;
}

//return the average from a dataset
function getAverage(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
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

//standadise dataset into normal distribution
function standardise(array, mean, stDEV) {

  var standardiseFigures = [];
  for (var i = 0; i < array.length; i ++) {
    var temp = (array[i] - mean)/stDEV;
    standardiseFigures.push(temp);
  }
  return standardiseFigures;
}

//appreciates the values to makes the smallest in the dataset 0.
function getPositiveBounds(array) {

  var positiveBounds = [];

 Array.min = function( array ){
    return Math.min.apply( Math, array );
  }; //don't really understand this but look to https://stackoverflow.com/questions/8934877/obtain-smallest-value-from-array-in-javascript

  var minimum = Array.min(array);

  for (var i = 0; i < array.length; i ++) {
    var temp = array[i] - minimum;
    positiveBounds.push(temp);
  }
  return positiveBounds;
}

//applies the normal distribution to the total amount of values in the array.
function getVotingPower(array) {

  var voting = [];
  var lastRow = rankingTable.getLastRow() - 2;
  var sum = 0;

  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }

  for (var i = 0; i < array.length; i++) {
    var temp = (lastRow / sum) * array[i];
    voting.push(temp);
  }
  return voting;
}

//push an array into last empty column
function writeValues(array) {
  var lastColumn = rankingTable.getLastColumn() - 2;

  //This round function is added to intereact with other systems, and can be removed as necessary as well as making smallest number possible 1
  // for (i = 0 ; i < array.length; i++ ) {
  //   if (array[i] <= 1) {
  //     rankingTable.getRange(i + 3 , lastColumn).setValue('1');
  //   }
  //   else {
  //     rankingTable.getRange(i + 3 , lastColumn).setValue(Math.round(array[i]));
  //   }
  // }

  //This is the above with the round function
  for (i = 0 ; i < array.length; i++ ) {
      rankingTable.getRange(i + 3 , lastColumn).setValue(array[i]);
  }


}
