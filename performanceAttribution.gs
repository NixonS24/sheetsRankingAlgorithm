
//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

//
function performanceAttribute() {

  var companyNames = [];
  getCompanyNames(companyNames); //get an array of Company Names
  //var duplicateCompanyNames = companyName.slice();

  createSheets(companyNames); //creates sheets from the Company Names if they don't exist

  updateCompanyTables(companyNames);
}

function updatedCompanyTables(array) {

  for (element in array) {
    var tempCompanyNameSheet = ss.getSheetByName(array[element]);
    var lastRow = tempCompanyNameSheet.getLastRow();
    var companyPrice = companySheet.getRange(2, element + 2).getValue(); //array starts at 0 but prices at companySheet start at column 2

    //creating target columns for string formatting
    var previousRow = lastRow;
    var currentRow = lastRow + 1;
    var futureRow = lastRow + 2;

    //fomating strings
    if (lastRow <= 3) {
      var adjustedReturnAddition = ''; //for for Row, there will be no way to calculate returns
      var returnAddition = '';
    }
    else {
      var adjustedReturnAddition = ('=B' + currentRow + '/' + 'B' + previousRow);
      var returnAddition = ('=C' + currentRow + '- 1');
    }

    var timeAddition = ('=IF(C' + currentRow + ':C' + futureRow  + '= "" , 0 , H' + previousRow + ' + 1)');
    var standardDeviationAddition = ('=customRollingStDev(H' + currentRow + ',$F$2,1,$G$2,$F$3,5,$G$3)');
    var sharpeRatioAddition = ('=(I' + currentRow + '-J' + currentRow + ')/K' + currentRow);

    //Array to be added
    var newRow = [];
    newRow[0] = new Date();
    newRow[1] = companyPrice;
    newRow[2] = adjustedReturnAddition;
    newRow[3] = '';
    newRow[4] = '';
    newRow[5] = '';
    newRow[6] = ''
    newRow[7] = timeAddition
    newRow[8] = returnAddition;
    newRow[9] = riskFreeAddittion();
    newRow[10] = standardDeviationAddition;
    newRow[11] = sharpeRatioAddition;

    for (i = 0; i < newRow.length; i++) {
      tempCompanyNameSheet.getRange(currentRow , i + 1).setValue(newRow[i]);
    }
  }
}

function riskFreeAddittion() {
  var x = (1 + 1.5 / 100);
  var y = 1 / 365;
  var power = Math.pow(x, y) - 1;
  return power;
  //risk free is aassumed to be 1.5 for all time periods.
  //Adjusted for time interval -
}


function createSheets(array) {

  for (element in array) {
    var testSheet = ss.getSheetByName(array[element]);
    if (testSheet != null) {
      continue
    }
    else {
      ss.insertSheet().setName(array[element]);
      var sheet = ss.getSheetByName(array[element]);
      sheet.deleteRows(100, 900);
      formatFirstRow(array[element]);
      formatSecondRow(array[element]);
      formatThirdRow(array[element]);
    }
  }
}

function formatThirdRow(companyName) {

  var thirdRowValues = [];
  thirdRowValues[0] = '';
  thirdRowValues[1] = '';
  thirdRowValues[2] = '';
  thirdRowValues[3] = '';
  thirdRowValues[4] = 'Weekly';
  thirdRowValues[5] = '=customWeeklyStandardDeviation(C4:C.G3)';
  thirdRowValues[6] = '=G2/5';

  var tempSheet = ss.getSheetByName(companyName);

  for (i = 0; i < thirdRowValues.length; i++) {
    tempSheet.getRange(3 , i + 1).setValue(thirdRowValues[i]);
  }
}

function formatSecondRow(companyName) {
  var secondRowValues = [];
  secondRowValues[0] = '';
  secondRowValues[1] = '';
  secondRowValues[2] = '';
  secondRowValues[3] = '';
  secondRowValues[4] = 'Daily';
  secondRowValues[5] = '=customDailyStandardDeviation(C4:C,G2)';
  secondRowValues[6] = '=Count(C4:C)';

  var tempSheet = ss.getSheetByName(companyName);

  for (i = 0; i < secondRowValues.length; i++) {
    tempSheet.getRange(2 , i + 1).setValue(secondRowValues[i]);
  }
}

function formatFirstRow(companyName) {

  var firstRowValues = [];
  firstRowValues[0] = 'Time Stamp';
  firstRowValues[1] = 'Price';
  firstRowValues[2] = 'Adjusted Returns';
  firstRowValues[3] = '';
  firstRowValues[4] = '';
  firstRowValues[5] = 'St. Dev';
  firstRowValues[6] = 'Count'
  firstRowValues[7] = 'Time';
  firstRowValues[8] = 'Return';
  firstRowValues[9] = 'Risk Free';
  firstRowValues[10] = 'St.Dev';
  firstRowValues[11] = 'Sharpe ratio'

  var tempSheet = ss.getSheetByName(companyName);

  for (i = 0; i < firstRowValues.length; i++) {
    tempSheet.getRange(1 , i + 1).setValue(firstRowValues[i]);
  }
}
//receives an arary, and push elements into it from an object
function getCompanyNames(array) {
  var lastColumn = companySheet.getLastColumn();
  var targetCompanyRow = companySheet.getRange(1,2,1, lastColumn - 1).getValues();

  for (var i = 0; i < targetCompanyRow[0].length; i ++) {
    array.push(targetCompanyRow[0][i]);
  }

  return array;
}
