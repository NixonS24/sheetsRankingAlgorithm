//Global Declations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

function getMarketCap() {

  var companyTickers = getTickers(); //gets an object of compawny Tickers
  Logger.log(companyTickers);

  var marketCapValues = getMarketCapValues(companyTickers);
}

function getMarketCapValues(companyTickers) {

  //"https://api.iextrading.com/1.0/stock/aapl/stats"

  var baseURL = "https://api.iextrading.com/1.0/stock/" + companyTickers[0][0] + "/stats"

  var response = JSON.parse(UrlFetchApp.fetch(baseURL));

  Logger.log(response.symbol)
}

function getTickers() {
  var lastColumn = companySheet.getLastColumn();
  var tickerRow = 5;
  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();
  return companyTickers;
}
