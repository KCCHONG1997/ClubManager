function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Club Manager')
    .addItem('Make Nominal Role', 'openNominalRoleCreator')
    .addItem('Create new Event/Session', 'openSessionEventCreator')
    .addItem('Manager Lobby', 'openManagerLobby')
    // .addSeparator()
    // .addSubMenu(SpreadsheetApp.getUi().createMenu('My Submenu')
    //     .addItem('One Submenu Item', 'mySecondFunction')
    //     .addItem('Another Submenu Item', 'myThirdFunction'))
    .addToUi;

  createOrGetMainFolder();
}

function createOrGetMainFolder() {
  var mainFolderName = "ClubManagerDatabase";
  var subFolderNames = [
    "ClubManager_EventsGoogleForms",
    "ClubManager_EventsNominalRole",
    "ClubManager_DumpedFiles"
  ];
  var mainFolder;
  var folderIdsObject = {}; // Object to store the folder IDs

  // Check if the main folder exists
  var folders = DriveApp.getFoldersByName(mainFolderName);

  if (folders.hasNext()) {
    // Folder already exists, retrieve it
    mainFolder = folders.next();

    // Retrieve existing subfolders
    var existingSubfolders = mainFolder.getFolders();

    // Loop through the existing subfolders and store their IDs in the object
    while (existingSubfolders.hasNext()) {
      var subFolder = existingSubfolders.next();
      folderIdsObject[subFolder.getName().toUpperCase() + "_FOLDER_ID"] = subFolder.getId();
    }

    // Check if the "env.local.variables.txt" file exists in the main folder
    var files = mainFolder.getFilesByName("env.local.variables.txt");
    var file;
    if (files.hasNext()) {
      // File already exists, retrieve it
      file = files.next();
      Logger.log("File 'env.local.variables.txt' already exists in the main folder.");
    } else {
      // File does not exist, create it
      file = mainFolder.createFile("env.local.variables.txt", "");
      file.setContent(JSON.stringify(folderIdsObject));
      Logger.log("Created file 'env.local.variables.txt' in the main folder.");
    }
  } else {
    // Folder does not exist, create a new one
    mainFolder = DriveApp.createFolder(mainFolderName);

    // Create subfolders inside the main folder
    for (var i = 0; i < subFolderNames.length; i++) {
      var subFolderName = subFolderNames[i];
      var subFolder = mainFolder.createFolder(subFolderName);
      folderIdsObject[subFolderName.toUpperCase() + "_FOLDER_ID"] = subFolder.getId(); // Store the subfolder ID in the object
    }

    // Create the .txt file in the main folder
    var jsonString = JSON.stringify(folderIdsObject);
    var file = mainFolder.createFile("env.local.variables.txt", jsonString);
    Logger.log("Created file 'env.local.variables.txt' in the main folder.");
  }

  // Get the ID of the main folder
  var mainFolderId = mainFolder.getId();

  // Add the main folder ID to the object
  folderIdsObject.MAIN_FOLDER_ID = mainFolderId;

  Logger.log("Main folder ID: " + mainFolderId);
  Logger.log("Subfolder IDs: " + JSON.stringify(folderIdsObject));
}






function readFolderIdsFromFile() {
  var mainFolderName = "ClubManagerDatabase";
  var mainFolder;
  var folderIdsObject = {}; // Object to store the folder IDs

  // Check if the main folder exists
  var folders = DriveApp.getFoldersByName(mainFolderName);

  if (folders.hasNext()) {
    // Folder already exists, retrieve it
    mainFolder = folders.next();
  } else {
    // Folder does not exist, handle the error condition
    Logger.log("Main folder not found.");
    return;
  }

  // Check if the "env.local.variables.txt" file exists in the main folder
  var files = mainFolder.getFilesByName("env.local.variables.txt");

  if (files.hasNext()) {
    // File exists, read its content
    var file = files.next();
    var fileContent = file.getBlob().getDataAsString();
    
    // Parse the JSON content into an object
    folderIdsObject = JSON.parse(fileContent);

    // Log the folder IDs
    Logger.log("Main folder ID: " + folderIdsObject.MAIN_FOLDER_ID);
    for (var key in folderIdsObject) {
      if (key !== "MAIN_FOLDER_ID") {
        Logger.log(key + ": " + folderIdsObject[key]);
      }
    }
  } else {
    // File does not exist, handle the error condition
    Logger.log("Folder IDs file not found.");
  }
}





function doGet(e) {
  // return HtmlService.createHtmlOutputFromFile("managerLobby");
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('managerLobby').evaluate();
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
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


function getEventTimeslots(googleFormID) {
  console.log(googleFormID);
  try {
    var form = FormApp.openById(googleFormID);
    var formItems = form.getItems();
    var returnObj = {}
    formItems.forEach((item) => {
      // Logger.log(item.getTitle());
      if (item.getType() == FormApp.ItemType.MULTIPLE_CHOICE && item.getTitle() == "Select timeline. (If there is only one, just pick the only options)") {
        // Logger.log(item.asMultipleChoiceItem().getChoices()[0].getValue()); // return array of choices  ---- FIXED
        var choicesArr_obj = item.asMultipleChoiceItem().getChoices();
        var choicesArr_text = choicesArr_obj.map(x => x.getValue());
        returnObj = { arr: choicesArr_text, status: "success" } // NEVER PUT A return inside a forEach Loop
      } else {
        returnObj = { msg: "Error: " + "Cannot find the multiple choice question", status: "error" }
      }
    })
    return returnObj
  } catch (e) {
    return { msg: "Error: " + e, status: "error" }
  }
}

function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  //  Logger.log(url);
  return url;
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
