//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');
var fundValueFormattingSheet = ss.getSheetByName('Fund Value FormattingCSV');


function fundValuesForUpload() {

  //zclearSheet();

  setFundValue();

  setFundChange();

  setCompanyNames();

  setCompanyTickers();

  setIndividualAssetAllocation();
}

function setIndividualAssetAllocation() {
  var lastColumn = companySheet.getLastColumn();
  var invidiualCompanyValues = companySheet.getRange(tickerRow + 10 ,2, 1, lastColumn - 1).getValues();
  var startingColumnPosition = 2;

  for (var i = 0; i < invidiualCompanyValues[0].length; i++) {
    fundValueFormattingSheet.getRange(5, startingColumnPosition + i).setValue(invidiualCompanyValues[0][i]);
  }

}

function setCompanyTickers() {
  var lastColumn = companySheet.getLastColumn();
  var companyTickers = companySheet.getRange(tickerRow,2, 1, lastColumn - 1).getValues();
  var startingColumnPosition = 2;

  for (var i = 0; i < companyTickers[0].length; i++) {
    fundValueFormattingSheet.getRange(4, startingColumnPosition + i).setValue(companyTickers[0][i]);
  }

}

function setCompanyNames() {
  var lastColumn = companySheet.getLastColumn();
  var companyNames = companySheet.getRange(1,2, 1, lastColumn - 1).getValues();
  var startingColumnPosition = 2;

  for (var i = 0; i < companyNames[0].length; i++) {
    fundValueFormattingSheet.getRange(3, startingColumnPosition + i).setValue(companyNames[0][i]);
  }
}


function setFundChange() {
  var fundValueChangeName = 'Fund_Change';
  var fundValueChangeFigure = companySheet.getRange(tickerRow + 9, 3).getValue();

  fundValueFormattingSheet.getRange(2,1).setValue(fundValueChangeName);
  fundValueFormattingSheet.getRange(2,2).setValue(fundValueChangeFigure);

}

function setFundValue() {
  var fundValueName = 'Fund_Value';
  var fundValueFigure = companySheet.getRange(tickerRow + 9, 2).getValue();

  fundValueFormattingSheet.getRange(1,1).setValue(fundValueName);
  fundValueFormattingSheet.getRange(1,2).setValue(fundValueFigure);
}
