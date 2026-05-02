// 1. Open a Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this code and Save
// 4. Run 'initialSetup' function once to create headers
// 5. Publish > Deploy as Web App > Who has access: "Anyone"
// 6. Copy the URL and replace 'YOUR_SCRIPT_URL_HERE' in script.js and career/index.html

const CONTACT_SHEET_NAME = "Contact_Data";
const CAREER_SHEET_NAME = "Career_Data";
const CAREER_FOLDER_NAME = "Career_Applications";

function doGet(e) {
  return HtmlService.createHtmlOutput("Post Only");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Parse Data (Handle both JSON and FormData)
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback or specific JSON error handling
        data = e.parameter; // Unlikely if postData exists but good for safety
      }
    } else {
      data = e.parameter;
    }

    const formType = data.formType || 'contact'; // Default to contact if missing

    if (formType === 'contact') {
      return handleContactForm(doc, data);
    } else if (formType === 'career') {
      return handleCareerForm(doc, data);
    } else {
       return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": "Unknown form type" }))
      .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// --- Handler: Contact Form ---
function handleContactForm(doc, params) {
    let sheet = doc.getSheetByName(CONTACT_SHEET_NAME);
    if (!sheet) {
      sheet = doc.insertSheet(CONTACT_SHEET_NAME);
      const headers = ["Timestamp", "Name", "Email", "Subject", "Message"];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    const timestamp = new Date();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(header => {
      if (header === 'Timestamp') return timestamp;
      return params[header.toLowerCase()] || ""; 
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    return successResponse("Message Sent Successfully");
}

// --- Handler: Career Form ---
function handleCareerForm(doc, data) {
    let sheet = doc.getSheetByName(CAREER_SHEET_NAME);
    
    // 1. Setup Sheet if needed
    if (!sheet) {
      sheet = doc.insertSheet(CAREER_SHEET_NAME);
      const headers = ["Timestamp", "Name", "Email", "Mobile", "Post", "Resume Link", "Folder Link"];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    const timestamp = new Date();
    const name = data.name;
    const email = data.email;
    const mobile = data.mobile;
    const post = data.post;
    
    // 2. Handle File Upload (Drive)
    let fileUrl = "";
    let folderUrl = "";
    
    if (data.resumeData && data.resumeName) {
       const rootFolder = getOrCreateFolder(CAREER_FOLDER_NAME);
       // Create unique subfolder for applicant: "Name_Mobile"
       const applicantFolderName = `${name}_${mobile}`.replace(/[^a-zA-Z0-9_\-]/g, '_');
       const applicantFolder = getOrCreateFolder(applicantFolderName, rootFolder);
       
       const blob = Utilities.newBlob(Utilities.base64Decode(data.resumeData), data.resumeMimeType, data.resumeName);
       const file = applicantFolder.createFile(blob);
       
       fileUrl = file.getUrl();
       folderUrl = applicantFolder.getUrl();
    }

    // 3. Save to Sheet
    sheet.appendRow([timestamp, name, email, mobile, post, fileUrl, folderUrl]);

    // 4. Send Email Confirmation
    sendConfirmationEmail(email, name, post);

    return successResponse("Application Submitted Successfully");
}

// --- Helper: Response ---
function successResponse(msg) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": msg }))
      .setMimeType(ContentService.MimeType.JSON);
}

// --- Helper: Drive Folder ---
function getOrCreateFolder(folderName, parentFolder = DriveApp) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}

// --- Helper: Email ---
function sendConfirmationEmail(email, name, post) {
    if (!email) return;
    
    const subject = `Application Received: ${post} - Nishant Tyagi & Associates`;
    const body = `Dear ${name},<br><br>
    
    Thank you for applying for the position of <strong>${post}</strong> at Nishant Tyagi & Associates.<br><br>
    
    We have successfully received your application and resume. Our team will review your qualifications and reach out if your profile matches our requirements.<br><br>
    
    Best Regards,<br>
    <strong>HR Team</strong><br>
    Nishant Tyagi & Associates`;

    try {
        MailApp.sendEmail({
            to: email,
            subject: subject,
            htmlBody: body
        });
    } catch (e) {
        console.log("Email failed: " + e.toString());
        // Don't fail the whole request just because email failed
    }
}

function initialSetup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  
  // Setup Contact
  let cSheet = doc.getSheetByName(CONTACT_SHEET_NAME);
  if (!cSheet) {
    cSheet = doc.insertSheet(CONTACT_SHEET_NAME);
    const h1 = ["Timestamp", "Name", "Email", "Subject", "Message"];
    cSheet.getRange(1, 1, 1, h1.length).setValues([h1]);
  }
  
  // Setup Career
  let kSheet = doc.getSheetByName(CAREER_SHEET_NAME);
  if (!kSheet) {
    kSheet = doc.insertSheet(CAREER_SHEET_NAME);
    const h2 = ["Timestamp", "Name", "Email", "Mobile", "Post", "Resume Link", "Folder Link"];
    kSheet.getRange(1, 1, 1, h2.length).setValues([h2]);
  }
}
