function connectToDB() {
  
  // Function to Encode to Hex
  // https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex/26375459
  String.prototype.hexEncode = function(){
    var hex, i;
    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
  }
  
  // Database Info
  var server = '';
  var dbName = '';
  var username = '';
  var password = '';
  var port = '';
  
  // Spreadsheet Info
  var ss = SpreadsheetApp.openById("");
  var sheet = ss.getSheetByName("Sheet1");
  
  // Pick a random release  
  var minRow = 2;
  var maxRow = sheet.getLastRow();
  var randomRow = Math.floor(Math.random() * (maxRow - minRow + 1) + minRow).toString();
  Logger.log(randomRow)
  
  // Pull Cell Values
  var range = sheet.getRange('A'+randomRow+':'+'O'+randomRow)
  var artist = range.getCell(1,1).getValue();
  var title = range.getCell(1,2).getValue();
  var imgURL = range.getCell(1,9).getValue();
  
  // Encode them to Hex
  var artistEncoded = artist.hexEncode().toString();
  Logger.log(artistEncoded);
  var titleEncoded = title.hexEncode().toString();
  Logger.log(titleEncoded);
  var imgURLEncoded = imgURL.hexEncode().toString();
  Logger.log(imgURLEncoded);  
  Logger.log(artist + ', ' + title + ', ' + imgURL)
    
  // Prepare queries to update database
  //var SQL_CREATE = 'CREATE TABLE TABLE_NAME(title LONGBLOB, artist VARCHAR(255), imgURL LONGBLOB)';
  var SQL_DELETE = 'DELETE FROM TABLENAME'
  var SQL_INSERT = 'INSERT INTO TABLENAME(title, artist, imgURL) values('+'"'+titleEncoded+'"'+', '+'"'+artistEncoded+'"'+', '+'"'+imgURLEncoded+'"'+');'
  
  // Connect to database and run query
  var url = 'jdbc:mysql://'+server+':'+port+'/'+dbName;
  var conn = Jdbc.getConnection(url,username,password);
  Logger.log("Connection open.")
  var stmt = conn.createStatement();
  var tableClear = stmt.execute(SQL_DELETE);
  var tableUpdate = stmt.execute(SQL_INSERT);
  Logger.log("Query Executed.")
  conn.close();
  Logger.log("Connection closed.")
}
