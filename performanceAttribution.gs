//This typically needs to be run at the same time each day to ensure consistency of standard deviaiton.

//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');
var tickerRow = 5; //This correponds to the string "Ticker" in companySheet, if this changes we will need to update

//Create Sharpe ratio and the put into centralised sheet
function performanceAttribute() {

  var companyTickers = getTickers2(); //get Values from Sheets
  Logger.log(companyTickers);

  var mostUpToDateCompanyPrices = getMostUpToDateCompanyPrices(companyTickers); //External API Call, using IEX
  Logger.log(mostUpToDateCompanyPrices);

  setMostUpToDateCompanyPricesInSheet(mostUpToDateCompanyPrices);

  createNewCompanySheetIfDoesNotExist(companyTickers);
}

function createNewCompanySheetIfDoesNotExist(companyTickers) {
  for (ticker in companyTickers) {
    var testReponse = ss.getSheetByName(companyTickers[ticker]);
    if (testReponse != null) {
      continue;
    }
    else {
      ss.insertSheet().setName(companyTickers[ticker]);
      var newSheet = ss.getSheetByName(companyTickers[ticker]);
      newSheet.deleteRows(100,900);
      formatFirstRow(companyTickers[ticker]);
      formatSecondRow(companyTickers[ticker]);
      formatRemainingRows(companyTickers[ticker]);
    }
  }
}

function formatFirstRow(ticker) {

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

  var tempSheet = ss.getSheetByName(ticker);

  for (i = 0; i < firstRowValues.length; i++) {
    tempSheet.getRange(1 , i + 1).setValue(firstRowValues[i]);
  }
}

function formatSecondRow(ticker) {
  var secondRowValues = [];
  secondRowValues[0] = '';
  secondRowValues[1] = '';
  secondRowValues[2] = '';
  secondRowValues[3] = '';
  secondRowValues[4] = 'Daily';
  secondRowValues[5] = '=If(G2 <= 7, 0.0215, STDEV(C4:C))'; //this will force us to have a speical companyUpdate when st.dev is calculated differently
  secondRowValues[6] = '=Count(C4:C)';

  var tempSheet = ss.getSheetByName(ticker);

  for (i = 0; i < secondRowValues.length; i++) {
    tempSheet.getRange(2 , i + 1).setValue(secondRowValues[i]);
  }
}

function formatRemainingRows(ticker) {
  var timeStamps = [];
  var closePrices = [];

  var baseURL = "https://api.iextrading.com/1.0/stock/" + ticker + "/time-series";
  var response = JSON.parse(UrlFetchApp.fetch(baseURL));
  for (var j = 0; j < response.length; j++) {
    timeStamps.push(response[j].date);
    closePrices.push(response[j].close);
  }

  var tempSheet = ss.getSheetByName(ticker);

  for (i = 0; i < timeStamps.length; i ++) {
    tempSheet.getRange(i + 3, 1).setValue(timeStamps[i]);
    tempSheet.getRange(i + 3, 2).setValue(closePrices[i]);
  }
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

  for (var i = 0; i < companyTickers.length; i++) {
    var baseURL = "https://api.iextrading.com/1.0/stock/" + companyTickers[i] + "/time-series";
    var response = JSON.parse(UrlFetchApp.fetch(baseURL));
    companyPrices.push(response[20].close) //There are 21 datapoints returns from IEX and we want the most recent (probably needs to be refactored for dependency)
  }
  return companyPrices;
}

function getTickers2() {
  var array = [];
  var lastColumn = companySheet.getLastColumn();
  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();

  for (var i = 0; i < companyTickers[0].length; i++) {
    array.push(companyTickers[0][i]);
  }
  return array;
}
