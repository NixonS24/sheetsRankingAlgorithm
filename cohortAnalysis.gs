function cohortAnalysis() {
  //Global Declarations
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var userRankingsSheet = ss.getSheetByName("Users Rankings Pull");
  var rankingSheet = ss.getSheetByName('rankingTable');
  var cohortAnalysisSheet = ss.getSheetByName('cohortAnalysis');


  createCohortSheet(cohortAnalysisSheet);

  //var userIDs = getUserIDs();
  //Logger.log(userIDs);
  var userIDs = ['481','468', '473']

  var userEngamentScore = getUserEngagementScores(userIDs); //This is predefined as



  //Functions


  function createCohortSheet(cohortAnalysisSheet) {
    if (cohortAnalysisSheet == null) {
      ss.insertSheet().setName('cohortAnalysis').deleteRows(100,900);
    }
    else {
      return;
    }
  }

  function getUserIDs() {
    var userIDs = [];
    var lastRow = userRankingsSheet.getLastRow();
    var userRowRange = lastRow - 1;
    var userIDObject = userRankingsSheet.getRange(2,1,userRowRange,1).getValues();

    for (var i = 0; i < userIDObject.length; i++) {
      userIDs.push(userIDObject[i][0]);
    }
    return userIDs;
  }

  function getUserEngagementScores(userIDs) {
    for (user in userIDs) {
      numOfVotesToTotalVotesCast = [];
      tempUserSheet = ss.getSheetByName(userIDs[user]);
      tempUserSheetLastRow = parseInt(tempUserSheet.getLastRow()) - 1;
      Logger.log(tempUserSheetLastRow);
      tempUserSheetTargetValues = tempUserSheet.getRange(2,1,tempUserSheetLastRow,1).getValues();

      for (var i = 1; i < tempUserSheetTargetValues.length; i += 2) {
        numOfVotesToTotalVotesCast.push(tempUserSheetTargetValues[i][0]);
      }
      Logger.log(numOfVotesToTotalVotesCast);

      var changeInUserEngagementScore = makeChangeInUserEngagamentScore(numOfVotesToTotalVotesCast);

      setUserEngagementScore(changeInUserEngagementScore);
    }
  }

  function makeChangeInUserEngagamentScore(userEngamentScore) {
    Logger.log(userEngamentScore);
    var changeInUserEngagementScore = [];
    for (var i = 0; i < userEngamentScore.length; i ++) {
      switch (i) {
        case 0:
          if (userEngamentScore[i] != 0) {
            changeInUserEngagementScore.push('1');
            Logger.log('case 0, not 0');
            continue;
          } else {
            changeInUserEngagementScore.push('0');
            Logger.log('case 0, else case');
            continue;
          }
        default:
          if (userEngamentScore[i] - userEngamentScore[i - 1] != 0) {
            changeInUserEngagementScore.push('1');
            Logger.log('default case, not 0;=');
            continue;
          } else {
            changeInUserEngagementScore.push('0');
            Logger.log('default case, else case');
            continue;
          }
      }
    }
    return changeInUserEngagementScore;
  }

  function setUserEngagementScore(changeInUserEngagementScore) {
    var beginningOfRowFormatting = 2;
    var beginningOfColumnFormating = 3;
    var cohortAnalysisLastRow = cohortAnalysisSheet.getLastRow() + 1;
    var cohortAnalysisNumberOfUsedRow = cohortAnalysisLastRow - beginningOfRowFormatting;

    for (var i = 0; i < changeInUserEngagementScore.length; i ++) {
      var temp = cohortAnalysisSheet.getRange(cohortAnalysisLastRow - changeInUserEngagementScore.length, 8 - changeInUserEngagementScore.length + i).getValue();
      temp += parseFloat(changeInUserEngagementScore[i])
      cohortAnalysisSheet.getRange(cohortAnalysisLastRow - changeInUserEngagementScore.length, 8 - changeInUserEngagementScore.length + i).setValue(temp);
    }

    //This is a user count.
    var temp2 = cohortAnalysisSheet.getRange(8 - changeInUserEngagementScore.length, 1).getValue();
    temp2 += 1;
    cohortAnalysisSheet.getRange(8 - changeInUserEngagementScore.length, 1).setValue(temp2);
  }
}
