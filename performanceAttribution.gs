
//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

//
function performanceAttribute() {

  var companyNames = [];
  getCompanyNames(companyNames); //get an array of Company Names

  createSheets(companyNames); //creates sheets from the Company Names if they don't exist

  updateCompanyTables(companyNames); //pull the current prices into there corresponding sheets and update

  updateCompanySheet(companyNames);
}

function updateCompanySheet(array) {

  var count = 2;
  var companySheetLastRow = companySheet.getLastRow();

  if (companySheetLastRow < 3) {
    companySheetLastRow = 3;
  }
  Logger.log(companySheetLastRow);

  for (element in array) {
    var nameSheet = ss.getSheetByName(array[element]);

    if (nameSheet == null) {
      continue;
      count ++;
    }
    else {
      var nameSheetLastRow = nameSheet.getLastRow();
      var nameSheetData = nameSheet.getRange(nameSheetLastRow, 12).getValue()
      companySheet.getRange(companySheetLastRow + 1, count).setValue(nameSheetData);
      count ++;
    }
  }
}

function updateCompanyTables(array) {

  var count = 0

  for (element in array) {
    var tempCompanyNameSheet = ss.getSheetByName(array[element]);
    if (tempCompanyNameSheet == null) {
      continue;
      count ++;
    }
    else {
      var lastRow = tempCompanyNameSheet.getLastRow();
      var companyPrice = companySheet.getRange(2, count + 2).getValue(); //array starts at 0 but prices at companySheet start at column 2
      Logger.log(array[element] + element + companyPrice)
      //creating target columns for string formatting
      var previousRow = lastRow;
      var currentRow = lastRow + 1;
      var futureRow = lastRow + 2;

      //fomating strings
      if (lastRow <= 2) {
        var adjustedReturnAddition = ''; //for for Row, there will be no way to calculate returns
        var returnAddition = '';
      }
      else {
        var adjustedReturnAddition = ('=B' + currentRow + '/' + 'B' + previousRow);
        var returnAddition = ('=C' + currentRow + '- 1');
      }

      var timeAddition = ('=IF(C' + currentRow + ':C' + futureRow  + '= "" , 0 , H' + futureRow + ' + 1)');
      var standardDeviationAddition = ('=F2');
      var sharpeRatioAddition = ('=(I' + currentRow + '-J' + currentRow + ')/K' + currentRow);

      //Array to be added
      var newRow = [];
      newRow[0] = new Date();
      newRow[1] = companyPrice;
      newRow[2] = adjustedReturnAddition;
      newRow[3] = '';
      newRow[4] = '';
      newRow[5] = '';
      newRow[6] = ''
      newRow[7] = timeAddition
      newRow[8] = returnAddition;
      newRow[9] = '0.0000407915511135837';
      newRow[10] = standardDeviationAddition;
      newRow[11] = sharpeRatioAddition;

      for (i = 0; i < newRow.length; i++) {
        tempCompanyNameSheet.getRange(currentRow , i + 1).setValue(newRow[i]);
      }
      count++;
    }
  }
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
      formatSecondRow(array[element]);
    }
  }
}


function formatSecondRow(companyName) {
  var secondRowValues = [];
  secondRowValues[0] = '';
  secondRowValues[1] = '';
  secondRowValues[2] = '';
  secondRowValues[3] = '';
  secondRowValues[4] = 'Daily';
  secondRowValues[5] = '=If(G2 <= 7, 0.0215, STDEV(C4:C))'; //this will force us to have a speical companyUpdate when st.dev is calculated differently
  secondRowValues[6] = '=Count(C4:C)';

  var tempSheet = ss.getSheetByName(companyName);

  for (i = 0; i < secondRowValues.length; i++) {
    tempSheet.getRange(2 , i + 1).setValue(secondRowValues[i]);
  }
}

function formatFirstRow(companyName) {

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

  var tempSheet = ss.getSheetByName(companyName);

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
