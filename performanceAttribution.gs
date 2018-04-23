//This typically needs to be run at the same time each day to ensure consistency of standard deviaiton.

//Global Declarations
var ss = SpreadsheetApp.getActiveSpreadsheet();
var companySheet = ss.getSheetByName('CompanySheet');

//Create Sharpe ratio and the put into centralised sheet
function performanceAttribute() {

  var companyNames = [];
  getCompanyNames(companyNames); //get an array of Company Names

  createSheets(companyNames); //creates sheets from the Company Names if they don't exist

  updateCompanyTables(companyNames); //pull the current prices into their corresponding sheets and update

  updateCompanySheet(companyNames); //pull the sharpe ratio in their corresponding places into a sheet called 'Company Sheet'
}

//grab specific values from different sheets and puts them into one centralised sheet
function updateCompanySheet(array) {

  var count = 2;
  var companySheetLastRow = companySheet.getLastRow();

  if (count = 2) {
    timeStamp();
  }

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

function timeStamp() {
  var lastRow = companySheet.getLastRow() + 1;
  companySheet.getRange(lastRow, 1).setValue(new Date());
}

//
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
      newRow[9] = '0.0000407915511135837'; //risk free if 1.5% divided into daily figure
      newRow[10] = standardDeviationAddition;
      newRow[11] = sharpeRatioAddition;

      for (i = 0; i < newRow.length; i++) {
        tempCompanyNameSheet.getRange(currentRow , i + 1).setValue(newRow[i]);
      }
      count++;
    }
  }
}

//creates new sheet from an array with specific formating
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

//create format of second row
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

//create format of firstRow
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

//receives an array from row 1, and pushes elements in array
function getCompanyNames(array) {
  var lastColumn = companySheet.getLastColumn();
  var targetCompanyRow = companySheet.getRange(1,2,1, lastColumn - 1).getValues();

  for (var i = 0; i < targetCompanyRow[0].length; i ++) {
    array.push(targetCompanyRow[0][i]);
  }

  return array;
}
