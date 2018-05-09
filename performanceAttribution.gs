//This typically needs to be run at the same time each day to ensure consistency of standard deviaiton.

//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');
var tickerRow = 5; //This correponds to the string "Ticker" in companySheet, if this changes we will need to update

//Create Sharpe ratio and the put into centralised sheet
function performanceAttribute() {

  var companyTickers = getTickers(); //get Values from Sheets
  Logger.log(companyTickers);

  var mostUpToDateCompanyPrices = getMostUpToDateCompanyPrices(companyTickers); //External API Call, using IEX
  Logger.log(mostUpToDateCompanyPrices);

  setMostUpToDateCompanyPricesInSheet(mostUpToDateCompanyPrices);

  sleep(1000); //to make sure company prices have loaded. 
}

function setMostUpToDateCompanyPricesInSheet(mostUpToDateCompanyPrices) {
  var companyValuesRow = tickerRow - 3;
  for (var i = 0; i < mostUpToDateCompanyPrices.length; i++) {
    var columnPosition = i + 2;
    companySheet.getRange(companyValuesRow, columnPosition).setValue(mostUpToDateCompanyPrices[i]);
  }
}

function getMostUpToDateCompanyPrices(companyTickers) {
  var companyPrices = [];

  for (var i = 0; i < companyTickers[0].length; i++) {
    var baseURL = "https://api.iextrading.com/1.0/stock/" + companyTickers[0][i] + "/time-series";
    var response = JSON.parse(UrlFetchApp.fetch(baseURL));
    companyPrices.push(response[20].close) //There are 21 datapoints returns from IEX and we want the most recent (probably needs to be refactored for dependency)
  }
  return companyPrices;
}

function getTickers() {
  var lastColumn = companySheet.getLastColumn();
  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();
  return companyTickers;
}
