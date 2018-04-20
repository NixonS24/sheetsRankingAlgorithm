
//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

//
function performanceAttribute() {

  var companyNames = [];
  getCompanyNames(companyNames); //get an array of Company Names

  createSheets(companyNames); //creates sheets from the Company Names if they don't exist

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
  thirdRowValues[5] = '=customWeeklyStandardDeviation';
  thirdRowValues[6] = '=customWeeklyCount';

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
  secondRowValues[5] = '=STDEV(C4:C)';
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
