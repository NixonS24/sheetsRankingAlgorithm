
function betaWeighting(input) {
  return Math.log(input);

  //Input refers to number of days away from current voting period
  //Potential we could enter in a date and minus today and add to function
}



function customRollingStDev(time_required , stDev , time_current, count, StDev_1, time_current_1, count_1) {
  //time_required = time required in days 1,2,3,4, 5;
  //price, e.g. $2.15;
  //time_current = current time of price;

  var time_discounted;


  //discounting public holday and weekends on average
  if (time_required < 0) {
    throw 'cant have negative required time value';
  }
   else if (time_required < 3) {
     time_discounted = time_required;
  }
  else if (time_required <= 20) {
     time_discounted = time_required * (5 / 7);
  }
  else if (time_required > 20) {
     time_discounted = time_required * 20.7875 / (365 / 12);
  }
  else {
     time_discounted = time_required;
  }



  var y_intecept = (stDev - 0.0021 * time_current);
  var rolling_average = (0.0021 * time_discounted + y_intecept);

  var y_intecept_1 = (StDev_1 - 0.0021 * time_current_1);
  var rolling_average_1 = (0.0021 * time_discounted + y_intecept_1);

  var total = count + count_1;
  var combined_average = (count / total) * rolling_average + (count_1 / total) * rolling_average_1;
  //stabiising function

  return combined_average;



  //This is taking from a regression against rolling standard deviation of Tesla
  //Assumption that rate of change is constant between assets
  //I.e T = 0 , T =1, T =2, T = 3,
  //
}

function customRiskFreeAdjustment() {
  var x = (1 + 1.5 / 100);
  var y = 1 / 365;
  var power = Math.pow(x, y) - 1;
  return power;

  //rask free is aassumed to be 1.5 for all time periods.
  //Adjusted for time interval -
}
