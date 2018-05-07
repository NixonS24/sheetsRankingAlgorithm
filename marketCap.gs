//Global Declations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

function getMarketCap() {

  var companyTickers = getTickers(); //gets an object of compawny Tickers
  Logger.log(companyTickers);

  var marketCapValues = getMarketCapValues(companyTickers);
}

function getMarketCapValues(companyTickers) {

  // base format "https://api.iextrading.com/1.0/stock/aapl/stats"

  var marketCapValues = [];

  for (var i = 0; i < companyTickers[0].length; i++) {
    var baseURL = "https://api.iextrading.com/1.0/stock/" + companyTickers[0][i] + "/stats"

    var response = JSON.parse(UrlFetchApp.fetch(baseURL));

    marketCapValues.push(response.marketcap);
  }
  Logger.log(marketCapValues);
}


function getTickers() {
  var lastColumn = companySheet.getLastColumn();
  var tickerRow = 5;
  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();
  return companyTickers;
}
