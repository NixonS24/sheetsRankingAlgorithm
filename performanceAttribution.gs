
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
    }
  }
}

function formatFirstRow(name) {

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

  var tempSheet = ss.getSheetByName(name);

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
