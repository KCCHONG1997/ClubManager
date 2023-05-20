function checkIfGoogleFormNameExist(formName) {
  try {
    var folder = DriveApp.getFolderById(googleFormFolderID);
    var files = folder.getFilesByName(formName);

    return files.hasNext(); // Returns true if a file with the given name exists, false otherwise
  } catch (e) {
    // Logger.log({ msg: "Error: " + e, status: 'error', function: "checkIfGoogleFormNameExist" })
    return { msg: "Error: " + e, status: 'error', function: "checkIfGoogleFormNameExist" }
  }

}


function generateGoogleForm(eventInfo) {
  try {
    if (!checkIfGoogleFormNameExist(eventInfo.eventName)) {
      // Creating Google Forms
      var form = FormApp.create(eventInfo.eventName);
      var timelineOptions = [];

      eventInfo.timelines.forEach((timeline) => {
        var timelineInText = timeline.timelineDate + " || " + timeline.startTime + " - " + timeline.endTime;
        timelineOptions.push(timelineInText);
      })

      // Add form questions based on the submitted data
      var formItem_1 = form.addTextItem().setTitle("Admin Number").setRequired(true);
      var pattern = '[0-9]{6}[A-Z]{1}';
      var textValidation = FormApp.createTextValidation()
        .setHelpText("6 digits with an UPPERCASE letter")
        .requireTextContainsPattern(pattern)
        .build();
      formItem_1.setValidation(textValidation); // Use textValidation.build() to create the validation instance

      var formItem_2 = form.addTextItem().setTitle("Name (All UPPERCASE)").setRequired(true);
      var pattern = `[0-9a-z]`;
      var textValidation_ = FormApp.createTextValidation()
        .setHelpText("Name with ALL UPPERCASE letter as per NRIC")
        .requireTextDoesNotContainPattern(pattern)
        .build();
      formItem_2.setValidation(textValidation_); // Use textValidation.build() to create the validation instance

      form.addMultipleChoiceItem()
        .setTitle('Select timeline. (If there is only one, just pick the only options)')
        .setRequired(true)
        .setChoiceValues(timelineOptions)
        .showOtherOption(true);

      // move the google forms files from root to the designated folder directory
      var fileID = form.getId();
      moveFiles(fileID, googleFormFolderID);

      var formUrl = form.getEditUrl();

      Logger.log(formUrl);
      // Return the Google Form URL
      return formUrl;
    }
    else {
      return { msg: "Name already exist", status: "Error" }
    }
  } catch (e) {
    return { msg: "Error: " + e, status: "error" }
  }

}

function openSessionEventCreator() {
  try {
    var html = HtmlService.createHtmlOutputFromFile('sessionEventCreator').setWidth(950).setHeight(750);
    SpreadsheetApp.getUi().showModalDialog(html, 'Create an Event/Session');
  } catch (e) {
    return { msg: "Error: " + e, status: "error" }
  }

}

