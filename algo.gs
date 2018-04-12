function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  //Get Sheets Names
  var sheetsName = ss.getSheets();
  //Logger.log(sheetsName);
  var sheetArray = [];
  for (var i = 0; i < sheetsName.length; i++) {
    sheetArray.push(sheetsName[i].getName());
  }

  //Get names of users in an object
  var sheet6 = ss.getSheetByName("Users Rankings Pull");
  var lastRow = sheet6.getLastRow();
  var userName = sheet6.getRange(1,2,lastRow,1);
  var userNameValues = userName.getValues();


  //Duplicate Names of Users (above) so position is captured, and store as array because less complicated
  var userNameArray = [];
  for (var i = 0; i < userNameValues.length; i++) {
    userNameArray.push(userNameValues[i][0]);
  }
  //Logger.log('userNameArray');
  //Logger.log(userNameArray);



  //Remove Duplicates - this works because I am not comparing across different rows/columns
  for (var i = 0; i < userNameValues.length; i ++) {
    var count = 0;
    for (var t = 0; t < userNameValues.length; t ++) {

      if (userNameValues[i][0] === userNameValues[t][0]) {
        Logger.log(userNameValues[i] + '' + userNameValues[t] + ' special case');
        count ++;

        if (count >= 2) {
          userNameValues.splice(t,1);
        }
         continue;
      }
    }
  }
  //Logger.log(userNameValues);

  //Loop thoough userNames and see if there is a sheet already created for them.
  for (var name in sheetArray) {
    for (var i = 0; i < userNameValues.length; i ++) {

      //Check how array is being formatted after each loop, and where we are up to in sheetArray
      //Logger.log(sheetArray[name] + ' ' + userNameValues[i])

      if (userNameValues[i][0] === "Full name") {
        //Logger.log(userNameValues[i] + ' case 1')
        userNameValues.splice(i, 1);
        break;
      }
      else if (userNameValues[i][0] == "") {
        //Logger.log(userNameValues[i] + 'case 2')
        userNameValues.splice(i, 1);
        break;
      }
     else if (userNameValues[i][0] === sheetArray[name]) {
        //Logger.log(userNameValues[i] + 'case 3')
        userNameValues.splice(i, 1);
        break;
      }
    }
  }

//Logger.log(userNameValues);

  //Create new sheets from remaining
  for (var i = 0; i < userNameValues.length; i ++) {
    var newSheet = ss.getSheetByName(userNameValues[i][0]);

    //In case there is an error in the above code
    if (newSheet != null) {
      continue;
    }
    else {
      newSheet = ss.insertSheet();
      newSheet.setName(userNameValues[i][0]);

      var companyNameSheet = ss.getSheetByName("Users Rankings Pull");
      var maxColums = companyNameSheet.getMaxColumns();
      var companyNameRange = companyNameSheet.getRange(1,1,1,maxColums);
      var companyNameValues = companyNameRange.getValues();
      //Logger.log(companyNameValues);

      var newSheet2 = ss.getSheetByName(userNameValues[i][0]);
      //Logger.log(newSheet2);
      //Logger.log(companyNameValues[0].length); , needs the 0 because this an object and not a simple array.
      newSheet2.getRange(1, 2, 1, companyNameValues[0].length).setValues(companyNameValues);
    }
  }

  //Insert row into spreadsheet

  //Logger.log(userNameArray);

  var count = 1;

  userNameArray.forEach(function(name){

    var companyNameSheet = ss.getSheetByName("Users Rankings Pull");
    var maxColums = companyNameSheet.getMaxColumns(); //this may need to replaced with getLastColumn

    var tempSheet = ss.getSheetByName(name);
    //maybe think about try and throwing an error to reduce computing load.

    if (tempSheet == null) {
      //Logger.log(name + " " + count);
      count ++;
      return;
    } else {

      var companyNameRange = companyNameSheet.getRange(count,1,1,maxColums);
      var companyNameValues = companyNameRange.getValues();
      companyNameValues[0].unshift(new Date()); //add date to the front of the array, maybe format that this to only dates without the time
      //Logger.log(count + " " + companyNameValues);

      var lastRow = tempSheet.getLastRow() + 2; //adjusted to two for every second row
      //Logger.log(lastRow); This may need to be updated to insertColumn after position still not sure though - might not reduce computer load at all.
      tempSheet.getRange(lastRow, 1, 1, companyNameValues[0].length).setValues(companyNameValues);
     // Logger.log(tempSheetRange);
      count++;

      var betaRow = lastRow + 1; //the row to insert the Beta Function Values - directly below the votes
      var totalRankingScore = 0;
      for (var i = 0; i < companyNameValues[0].length; i++) {
        if (companyNameValues[0][i] == "0") {
          continue;
        }
        //Else if chuck in an exception here that you will skip if it already has a number, this will allow you to refactor and generate a ranking score that is not linked to to this loop/logic.
        else if (companyNameValues[0][i] == "-1" || companyNameValues[0][i] == "1") {
          //Logger.log(companyNameValues[0][i] + ' ' + i + ' case 1' );
          var valueColumn = i;
          var betaColumn = i + 1; //adjustement due to the different in indexing array (beginning at 0) vs sheet (beginning at 1)
          var importantCell = tempSheet.getRange(betaRow, betaColumn); //cell directly below the cote
          importantCell.setValue(betaFunction(betaColumn,tempSheet,lastRow));
          totalRankingScore += sumRankings(importantCell,companyNameValues[0][i]);
         //maybe something like var sum = 0 just below BetaRow
         //then have the SumRankings return a number and then =+ to sum
        }
        else {
          //Logger.log(companyNameValues[0][i] + ' ' + i + ' case 2');
          //continue;
        }

      }

      tempSheet.getRange(betaRow, 1).setValue(totalRankingScore);

      //write the rankings score here
    }







    //This value is going to be stored just under the voting figures
    //loop through array of companyNameValues
    //if 0 move on
    //HLookup function, which needs to be stored as one component of the string. St
        //look to spreadsheet to do this,
    //Custom Beta Function
        //Needs to take in time as an argument and do some subtraction from the frist date.
        //maybe this can subtract a row from the first one, and then potentiall round to nearest whole number
    //This is four decision making tree scenario - another component of the string
        //past of this needs to take in the hlookup function result && so not sure how this is going to work yet
    //






    //Logger.log(name);

  });
  //var sheetName2 = ss.getSheetByName(name)

  function betaFunction(col, userSheet, currentTimeRow) {
   var columnLetter = columnToLetter(col);

   var companySheet = ss.getSheetByName("CompanySheet");
   var lastColumn = companySheet.getLastColumn();
   var lastRow = companySheet.getLastRow();
   var maxRow = companySheet.getMaxRows();
   var lastColumnLetter = columnToLetter(lastColumn);

   var hLookup = ('=HLOOKUP(' + columnLetter + '1 , CompanySheet!A1:' + lastColumnLetter + maxRow + ',' + lastRow + ', FALSE)');

  var initialTime;
  var currentTime;
  switch(currentTimeRow) {
    case 3:
      Logger.log('case 1')
      break;
    case 5:
      Logger.log('case 2');
      initialTime = userSheet.getRange(3,1).setNumberFormat("00,000.0000000000").getValues();
      currentTime = userSheet.getRange(currentTimeRow, 1).setNumberFormat("00,000.0000000000").getValues();
      break;
    default:
      Logger.log('case 3');
      initialTime = userSheet.getRange(3,1).getValues();
      currentTime = userSheet.getRange(currentTimeRow, 1).setNumberFormat("00,000.0000000000").getValues();
  }


   var diffTime = currentTime[0][0] - initialTime[0][0];

   //var betaWeighting = 'cust
   var weighting = betaWeighting(diffTime);


   return (hLookup + '*' + weighting);
  }



 function sumRankings(targetSheet, vote) {
      var attribution = targetSheet.getValue(); //get the score
      //vote already has the value that I want

    if (vote == "1" && attribution > 0) {
       //vote is for the stock to go up
       //stock movement is up
       Logger.log('positive vote, positive movement');
       return attribution;
     }
     else if (vote == "1" && attribution < 0) {
       //vote is for the stock to go up
       //stock  movement is down
       Logger.log('positive vote, negative movement');
       return;
     }
     else if (vote == "-1" && attribution > 0) {
       //vote is for the stock market to go down
       //stock movement is up
       Logger.log('negative vote, positive movement');
       return;
     }
     else if (vote == "-1" && attribution < 0) {
       //vote is for the stock to go down
       //stock market movement is down
       Logger.log('negative vote, negative movenment');
       return attribution;
     }
     else {
       return;
     }

    }


}


//Code not directly in this function

 //Converts Column to Letter
 function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
 }





//test of formating the date funciton.
function testBetaFunction() {


 var ss = SpreadsheetApp.getActiveSpreadsheet();

  var userSheet = ss.getSheetByName("Sam Nixon");
  var currentTimeRow = userSheet.getLastRow();

   //Need to put an error function in here for the first time a spreadsheet is generated.
 // if (currentTimeRow == 3) {
   // Logger.log('correct error handling');
   // return;
 // }

  var initialTime;
  var currentTime;
  switch(currentTimeRow) {
    case 3:
      Logger.log('case 1')
      break;
    case 5:
      Logger.log('case 2');
      initialTime = userSheet.getRange(3,1).setNumberFormat("00,000.0000000000").getValues();
      currentTime = userSheet.getRange(currentTimeRow, 1).setNumberFormat("00,000.0000000000").getValues();
      break;
    default:
      Logger.log('case 3');
      initialTime = userSheet.getRange(3,1).getValues();
      currentTime = userSheet.getRange(currentTimeRow, 1).setNumberFormat("00,000.0000000000").getValues();
  }


  //var initialTime = userSheet.getRange(3,1).setNumberFormat("00,000.0000000000").getValues(); //stores as object
  //setNumberFormat("00,000.0000000000")
  //var currentTime = userSheet.getRange(currentTimeRow, 1).setNumberFormat("00,000.0000000000").getValues();

  Logger.log(initialTime);
  Logger.log(currentTimeRow);
  Logger.log(currentTime);

   //this codes needs to be put in the case arguments
  var diffTime = currentTime[0][0] - initialTime[0][0];

  Logger.log(diffTime);

  var weighting = betaWeighting(diffTime);

  Logger.log(weighting);


}


   function testSumRanking() {
     var ss = SpreadsheetApp.getActiveSpreadsheet();
     var targetSheet = ss.getSheetByName("Matt Jones");

     var attribution = targetSheet.getRange(8, 10).getValue();
     Logger.log(attribution);
     var vote = 1;
     Logger.log(vote);
     if (vote == "1" && attribution > 0) {
       //vote is for the stock to go up
       //stock movement is up
       Logger.log('positive vote, positive movement');
       return attribution;
     }
     else if (vote == "1" && attribution < 0) {
       //vote is for the stock to go up
       //stock  movement is down
       Logger.log('positive vote, negative movement');
       return;
     }
     else if (vote == "-1" && attribution > 0) {
       //vote is for the stock market to go down
       //stock movement is up
       Logger.log('negative vote, positive movement');
       return;
     }
     else if (vote == "-1" && attribution < 0) {
       //vote is for the stock to go down
       //stock market movement is down
       Logger.log('negative vote, negative movenment');
       return attribution;
     }
     else {
       return;
     }





        }







//grab data, loop through name and create new sheet if one does not exist
               //In this case we will need to grab the names of the companies as well
               //Insert new row or start the insert from the second column, not the first to put the time stamp in
//Put entire row into spreadsheet with corresponding name (row with 0 and -1), remember the time stamp
//Start generating the Tables, multiplication between HLookup &
                //HLookup
                      //first value is static in the current location
                      //second value is static but dependent upon the size of the table which changes (therefore need to get the size)
                      //row has a starting point which is depenent off the above cal, then increaes by 1 (count +-=1)
                      //"FALSE"
                //Risk Free Adjustement
                       //"customRiskFreeAdjustment(num), num is depedent upon the date (or could somehow work with the count above, which might be better but not sure)
