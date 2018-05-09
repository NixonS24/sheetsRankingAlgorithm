function testAPI() {
  IEXAPI() //input datapoint that is desired as arguement
}


function IEXAPI() {

  var ticker = "GOOG";
  var baseURL = "https://api.iextrading.com/1.0/stock/" + ticker + "/time-series";
  var response = JSON.parse(UrlFetchApp.fetch(baseURL));

  for (var i = 0; i < response.length; i++) {
    Logger.log(response[i].close);
  }

}
