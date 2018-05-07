//Global Declations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

function getMarketCap() {
  var lastColumn = companySheet.getLastColumn();
  var tickerRow = 5; //If we change the location of the TickerRow in the spreadsheet this number will have to be updated
  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();
  Logger.log(companyTickers);
}
