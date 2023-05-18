function onOpen(e) {
    SpreadsheetApp.getUi()
      .createMenu('SAC Manager')
      .addItem('Make Nominal Role', 'openNominalRoleCreator')
      .addItem('Make new Event/Session', 'openSessionEventCreator')
      // .addSeparator()
      // .addSubMenu(SpreadsheetApp.getUi().createMenu('My Submenu')
      //     .addItem('One Submenu Item', 'mySecondFunction')
      //     .addItem('Another Submenu Item', 'myThirdFunction'))
      .addToUi();
  }
  function doGet(e) {
    return HtmlService.createHtmlOutputFromFile("sessionEventCreator");
  }
  function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).setContent();
  }
  function moveFiles(sourceFileId, targetFolderId) {
    var file = DriveApp.getFileById(sourceFileId);
    var folder = DriveApp.getFolderById(targetFolderId);
    file.moveTo(folder);
  }
  function getSheetById(id) {
    return SpreadsheetApp.getActive().getSheets().filter(
      function (s) { return s.getSheetId() === id; }
    )[0];
  }
  
  
  function getEventTimeslotLength(googleFormID) {
    try {
      var form = FormApp.openById(googleFormID);
      var formItems = form.getItems();
      formItems.forEach((item) => {
        // Logger.log(item.getTitle());
        if (item.getType() == FormApp.ItemType.MULTIPLE_CHOICE && item.getTitle() == "Select timeline. (If there is only one, just pick the only options)") {
          Logger.log(item.asMultipleChoiceItem().getChoices()); // return array of choices
          var choicesArr = item.asMultipleChoiceItem().getChoices();
          return { choices: choicesArr, status: 'success' }
        }
      })
    } catch (e) {
      return { msg: "Error: " + e, status : "error"}
    }
  }
  
  
  
  // Testing Code
  function listFolderAndFiles() {
    var folder = DriveApp.getFiles()
  
    var i = 0
    while (folder.hasNext() && i < 10) {
      Logger.log(folder.next())
      i = i + 1;
    }
  }
  