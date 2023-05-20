function openNominalRoleCreator() {
    try {
      var html = HtmlService.createHtmlOutputFromFile('nominalRoleCreator').setWidth(950).setHeight(750);
      SpreadsheetApp.getUi().showModalDialog(html, 'Create Nominal Role for an Event');
    } catch (e) {
      return { msg: "Error:" + e, status: "error" }
    }
  
  }
  
  function getAvailableGoogleForm() {
    try {
      var googleFormFolder = DriveApp.getFolderById(googleFormFolderID);
      var folderList = [];
  
      var files = googleFormFolder.getFiles();
      while (files.hasNext()) {
        file = files.next();
        var row = {
          formID: file.getId(),
          formName: file.getName(),
        }
        folderList.push(row);
      }
      Logger.log(folderList);
      if (folderList.length > 0) {
        return folderList
      } else {
        return { msg: "Error: No file in directory", status: "error" }
      }
    } catch (e) {
      return { msg: "Error: " + e, status: "error" }
    }
  
  }
  
  
  
  
  function copyNominalRolePrime(eventName, timeslots) {
    try {
      for (var i = 0; i < timeslots.length; i++) {
        var nominalRolePrime = DriveApp.getFileById(nominalRolePrimeID);
        var folder = DriveApp.getFolderById(nominalRoleFolderID);
        var newNominalRole = nominalRolePrime.makeCopy(eventName + "_" +timeslots[i]).moveTo(folder);
      }
  
      return { nominalRoleID: newNominalRole.getId(), status: "success" }
    } catch (e) {
      return { msg: "Error: " + e, status: "error" }
    }
  }
  
  function createNominalRoleForEvents(eventName, timeslot) {
  
  }
  
  
  
  
  
  
  // Unfinished Function
  function getRegisteredMemberAdminNumber(formID) {
    var form = FormApp.openById('12iZuHh51qAmjgjxYEt0vONxkOELTW3exkjoLljHpbVQ');
    var formResponses = form.getResponses();
  
    // get AdminNumber from form. 
    for (var i = 0; i < formResponses.length; i++) {
      var adminNumberSignedUp = form.getResponses()[i].getItemResponses()[0].getResponse();
      Logger.log(adminNumberSignedUp);
    }
  
    // for (var i = 0; i < formResponses.length; i++) {
    //   var formResponse = formResponses[i];
    //   var itemResponses = formResponse.getItemResponses();
    //   for (var j = 0; j < itemResponses.length; j++) {
    //     var itemResponse = itemResponses[j];
    //     Logger.log('Response #%s to the question "%s" was "%s"',
    //       (i + 1).toString(),
    //       itemResponse.getItem().getTitle(),
    //       itemResponse.getResponse());
    //   }
    // }
  }