
//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

//
function performanceAttribute() {

  var companyNames = [];
  getCompanyNames(companyNames); //get an array of Company Names

//create spreadsheets
  //createSheets();

}

//receives an arary, and push elements into it from an object
function getCompanyNames(array) {
  var lastColumn = companySheet.getLastColumn();
  var targetCompanyRow = companySheet.getRange(1,2,1, lastColumn).getValues();

  for (var i = 0; i < targetCompanyRow[0].length; i ++) {
    array.push(targetCompanyRow[0][i]);
  }

  return array;
}
