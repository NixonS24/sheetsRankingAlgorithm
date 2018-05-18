//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');
var fundValueFormattingSheet = ss.getSheetByName('Fund Value FormattingCSV');


function fundValuesForUpload() {

  checkToSeeFundValueFormattingSheetExists()

  insertNewRows();

  setFundValue();

  setFundChange();

  setCompanyNames();

  setCompanyTickers();

  setIndividualAssetAllocation();
}

function checkToSeeFundValueFormattingSheetExists() {
  var fundValueFormattingSheet = ss.getSheetByName('Fund Value FormattingCSV');

  if (fundValueFormattingSheet == null) {
      ss.instertSheet().setName('Fund Value FormattingCSV');
  }
  else {
    return;
  }
}

function insertNewRows() {
  fundValueFormattingSheet.insertRows(1, 6);
}

function setFundValue() {
  var fundValueName = 'Fund_Value';
  var fundValueFigure = companySheet.getRange(tickerRow + 9, 2).getValue();

  fundValueFormattingSheet.getRange(1,1).setValue(fundValueName);
  fundValueFormattingSheet.getRange(1,2).setValue(fundValueFigure);
}

function setFundChange() {
  var fundValueChangeName = 'Fund_Change';
  var fundValueChangeFigure = companySheet.getRange(tickerRow + 9, 3).getValue();
  var fundValueChangeFigureTwoDecimalPlaces = (fundValueChangeFigure * 100).toFixed(2); //The output figure will be expressed as a percentage to two percentage points, to interact with Matt's system

  fundValueFormattingSheet.getRange(2,1).setValue(fundValueChangeName);
  fundValueFormattingSheet.getRange(2,2).setValue(fundValueChangeFigureTwoDecimalPlaces);

}

function setCompanyNames() {
  var lastColumn = companySheet.getLastColumn();
  var companyNames = companySheet.getRange(1,2, 1, lastColumn - 1).getValues();
  var startingColumnPosition = 2;

  for (var i = 0; i < companyNames[0].length; i++) {
    fundValueFormattingSheet.getRange(3, startingColumnPosition + i).setValue(companyNames[0][i]);
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

function setIndividualAssetAllocation() {
  var lastColumn = companySheet.getLastColumn();
  var invidiualCompanyValues = companySheet.getRange(tickerRow + 10 ,2, 1, lastColumn - 1).getValues();
  var startingColumnPosition = 2;

  for (var i = 0; i < invidiualCompanyValues[0].length; i++) {
    fundValueFormattingSheet.getRange(5, startingColumnPosition + i).setValue(invidiualCompanyValues[0][i]);
  }

}
