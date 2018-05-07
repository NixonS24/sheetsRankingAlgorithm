//Global Declations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');
var tickerRow = 5; //This correponds to the string "Ticker" in companySheet, if this changes we will need to update

function getPriceChange() {
  var companyTickers = getTickers(); //gets an object of compawny Tickers
  //Logger.log(companyTickers);

  var priceChangePercent = getPriceChangePercent(companyTickers); //External API with IEX

  setPriceChangeValuesInSheet(priceChangePercent); //writes


}

function setPriceChangeValuesInSheet(priceChangePercent) {

  for (i = 0; i < priceChangePercent.length; i++) {
    var columnPosition = i + 2;
    companySheet.getRange(tickerRow - 2, columnPosition).setValue(priceChangePercent[i])
  }
}


function getPriceChangePercent(companyTickers) {

  //base format https://api.iextrading.com/1.0/stock/aapl/quote
  var priceChangeValues = [];

  for (var i = 0; i < companyTickers[0].length; i++) {
    var baseURL = "https://api.iextrading.com/1.0/stock/" + companyTickers[0][i] + "/quote";
      var response = JSON.parse(UrlFetchApp.fetch(baseURL));
      priceChangeValues.push(response.changePercent)
  }
  return priceChangeValues;
}



function getTickers() {
  var lastColumn = companySheet.getLastColumn();

  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();
  return companyTickers;
}
