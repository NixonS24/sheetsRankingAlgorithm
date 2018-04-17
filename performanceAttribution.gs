
//This generally needs to be refactored as there is a lot of overlap is Class Usage which can slow down memory
//However it was built like this so individual components could be easily tested with firing the entire function
function recordHistory() {

 clearSharpeRatio();

 var ss = SpreadsheetApp.getActiveSpreadsheet();

 var sheet1 = ss.getSheetByName("CompanySheet"); //Get values


 var Google = sheet1.getRange(1,2,2);
 var Facebook = sheet1.getRange(1,3,2);
 var Tesla = sheet1.getRange(1,4,2);
 var Qantas = sheet1.getRange(1,5,2);
 var Atlassian = sheet1.getRange(1,6,2);
 var Commonwealth = sheet1.getRange(1,7,2);
 var BHP = sheet1.getRange(1,8,2);

 var AMP = sheet1.getRange(1,9,2);
 var Telstra = sheet1.getRange(1,10,2);
 var Woolworths = sheet1.getRange(1,11,2);
 var Alibaba = sheet1.getRange(1,12,2);
 var Oracle = sheet1.getRange(1,13,2);
 var Adidas = sheet1.getRange(1,14,2);
 var Berkshire = sheet1.getRange(1,15,2);
 var UBS = sheet1.getRange(1,16,2);
 var Citigroup = sheet1.getRange(1,17,2);
 var ASX = sheet1.getRange(1,18,2);
 var Dominoes = sheet1.getRange(1,19,2);
 var Amazon = sheet1.getRange(1,20,2);

  writeValues(Google, "Google");
  writeValues(Facebook, "Facebook");
  writeValues(Tesla, "Tesla");
  writeValues(Qantas,"Qantas");
  writeValues(Atlassian, "Atlassian");
  writeValues(Commonwealth, "Commonwealth");
  writeValues(BHP, "BHP");

  writeValues(AMP, "AMP");
  writeValues(Telstra, "Telstra");
  writeValues(Woolworths, "Woolworths");
  writeValues(Alibaba, "Alibaba");
  writeValues(Oracle,"Oracle");
  writeValues(Adidas, "Adidas");
  writeValues(Berkshire, "Berkshire");
  writeValues(UBS, "UBS");

  writeValues(Citigroup, "Citigroup");
  writeValues(ASX, "ASX");
  writeValues(Dominoes, "Dominoes");
  writeValues(Amazon, "Amazon");

  timeStamp(); //This may screw up usage order as we just made this change so check after tonight.

}




function clearSharpeRatio() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheet1 = ss.getSheetByName("CompanySheet"); //Get Value Sheet
  var numRow = sheet1.getLastRow();
  var numColums = sheet1.getLastColumn();
  var source = sheet1.getRange(4,2, numRow, numColums); //Clear all Sharpe Ratio data

  //I am not sure if I can refactor this and simply put a refresh page, and

  source.clear();

}


//Grab the current price of the company and then, put it its corresponding spreadsheet and update adjusted returns, risk free and standard deviation
 function writeValues(inputSheet, sheetName) {

   Utilities.sleep(1000); //Fixing Load Time Errors

   var ss = SpreadsheetApp.getActiveSpreadsheet();

   var values = inputSheet.getValues()
   //Grabs values from corresponding range of company

   var sheet2 = ss.getSheetByName(sheetName);
   //loads the corresponding sheet

   var lastRow = sheet2.getLastRow();

   //creates adjusted return formula, column C
   var aboveRow = lastRow + 2;
   var currentRow = lastRow + 1;
   var adjustedReturnsUpdate = ('=IF(B' + aboveRow + ' = "" , "",' + 'B' + aboveRow + '/' + 'B' + currentRow + ')');;

   //creates an adjusted time formula. column K
   var adjustedTimeUpdate = ('=IF(C' + currentRow + ' = "" , 0 ,' + 'K' + aboveRow + ' + 1)' );

   //updates return figure
   var returnUpdate = ('=C' + currentRow + '- 1');

   //Updats Risk free
   var riskFreeUpdate = ('=customRiskFreeAdjustment(K' + currentRow +')');

   //Updates Standard Deviation
   var standardDeviationUpdate = ('=customRollingStDev(K' + currentRow + ',$I$2,1,$J$2,$I$3,5,$J$3)');

   //Updates Sharpe Ratio
   var sharpeRatioUpdate = ('=(L' + currentRow + '-M' + currentRow + ')/N' + currentRow)

   var result = new Array();
   result[0] = new Date();
   result[1] = values[1][0];
   result[2] = adjustedReturnsUpdate;
   result[3] = "";
   result[4] = "";
   result[5] = "";
   result[6] = "";
   result[7] = "";
   result[8] = "";
   result[9] = "";
   result[10] = adjustedTimeUpdate;
   result[11] = returnUpdate;
   result[12] = riskFreeUpdate;
   result[13] = standardDeviationUpdate;
   result[14] = sharpeRatioUpdate

   sheet2.appendRow(result);

   copyTo(sheetName);
 }




function copyTo(sheetName) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  //capturing the Sharpe Ratio in each corresponding sheet
  var sheet4 = ss.getSheetByName(sheetName);
  var lastRow = sheet4.getLastRow();
   if (lastRow <= 25) {
    return;
  }
  var currentRow = lastRow - 25; //the starting row position "O:25" - may need to be updated if we are changing the starting position,
  //refactor to make determined based upon dates.
  var dataRange4 = sheet4.getRange(25, 15, currentRow); //
  var dataValues4 = dataRange4.getValues()


  //caputring all the columns in Company Sheet Row 1 with company names
  var sheet5 = ss.getSheetByName("CompanySheet"); //Get values
  var maxColumns = sheet5.getMaxColumns();
  var source5 = sheet5.getRange(1,1,1,maxColumns);
  var values5 = source5.getValues();


//Loop through the names of the company, and match the sheetname to its corresponding column position
  for (var row in values5) {
    for (var col in values5[row]) {
      if (sheetName === values5[row][col]) {
       // returns the corresponding colum
        var col2 = parseInt(col);
        col2 += 1;
        sheet5.getRange(4,col2, dataValues4.length).setValues(dataValues4);
      }
    }
  }
}

function timeStamp() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var googleSheet = ss.getSheetByName("Google");
  var lastRow = googleSheet.getLastRow();
  var currentCol = lastRow - 25;
  var timeValuesGoogle = googleSheet.getRange(25, 1,currentCol).getValues();

  var companySheet = ss.getSheetByName("CompanySheet");
  var lastRow = companySheet.getLastRow() + 1;
  companySheet.getRange(4, 1, timeValuesGoogle.length).setValues(timeValuesGoogle);
}
