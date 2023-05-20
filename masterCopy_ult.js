function searchMemberByAdminNum(adminNum){
    var adminNum = "203505W";
    var masterCopySheet = getSheetById(masterCopySheetID);
    Logger.log(masterCopySheet);
  
    masterCopySheet.getSelection().setActiveRange("A:A"); // set the Admin Column
    var listAdmin = masterCopySheet.getActiveRange("A:A");
    Logger.log(listAdmin);
  
    // masterCopySheet.getDataRange().getValues();
  
    //   for (var i = 1; i < data.length; i++) {
    //   if (data[i][0] === adminNum) {
    //     return data[i]; // Return the row data
    //   }
    // }
  
    // return null; // Return null if admin number is not found
  }
  
  function test(){
    SpreadsheetApp.setActiveCell('K9');
    var selection = SpreadsheetApp.getSelection();
    var currentCell = selection.getCurrentCell();
    Logger.log(currentCell);
  }