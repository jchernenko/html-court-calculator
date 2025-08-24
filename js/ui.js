/**
 * ui.js - Contains UI-related functions
 * This file handles UI interactions, alerts, and display functions.
 * Updated to use single fingerprint result with consistent neutral styling.
 */

/**
 * Show an alert message
 * @param {string} message - Message to display
 */
function showAlert(message) {
  const alert = document.getElementById("alert-message");
  alert.textContent = message;
  alert.style.display = "block";
  setTimeout(() => {
    alert.style.display = "none";
  }, 5000);
}

/**
 * Copy content to clipboard
 */
function copySimpleText() {
  const content = document.getElementById("copy-content").innerText;
  const tempElement = document.createElement("textarea");
  tempElement.value = content;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand("copy");
  document.body.removeChild(tempElement);
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "Copied!";
  setTimeout(() => {
    button.textContent = originalText;
  }, 2000);
}

/**
 * Toggle the initial field based on city and case type
 */
function toggleInitialField() {
  const caseType = document.getElementById("case-type").value;
  const city = document.getElementById("city").value;
  const initialField = document.getElementById("initial");
  const caseTypeSelect = document.getElementById("case-type");
  const caseTypeLabel = document.querySelector('label[for="case-type"]');

  if (city === "richmond") {
    initialField.disabled = false;
    initialField.classList.remove("disabled-field");
    initialField.placeholder = "Enter first letter";

    if (caseType === "youth") {
      caseTypeLabel.innerHTML =
        'Case Type: <small style="font-weight:normal;color:#666;">(Richmond youth follow the same schedule as adults)</small>';
    } else {
      caseTypeLabel.innerHTML = "Case Type:";
    }
  } else if (
    caseType === "youth" ||
    city === "new-westminster" ||
    city === "coquitlam" ||
    city === "north-vancouver"
  ) {
    initialField.disabled = true;
    initialField.classList.add("disabled-field");
    let placeholder = "Not required";
    if (
      caseType === "youth" &&
      city !== "coquitlam" &&
      city !== "north-vancouver"
    ) {
      placeholder = "Not required for Youth";
    } else if (city === "new-westminster") {
      placeholder = "Not required for New Westminster";
    } else if (city === "coquitlam") {
      placeholder = "Not required for Coquitlam";
    } else if (city === "north-vancouver") {
      placeholder = "Not required for North Vancouver";
    }
    initialField.placeholder = placeholder;
    initialField.value = "";
    caseTypeLabel.innerHTML = "Case Type:";
  } else if (caseType === "youth" && city === "surrey") {
    initialField.disabled = true;
    initialField.classList.add("disabled-field");
    initialField.placeholder = "Not required for Youth";
    initialField.value = "";
    caseTypeLabel.innerHTML = "Case Type:";
  } else {
    initialField.disabled = false;
    initialField.classList.remove("disabled-field");
    initialField.placeholder = "Enter first letter";
    caseTypeLabel.innerHTML = "Case Type:";
  }
}

/**
 * Display the calculated dates in the UI
 * @param {Date} courtDate - Court date
 * @param {Date} fingerprintDate - Fingerprint date
 * @param {Object} courtDetails - Court details (time, address, note)
 * @param {Object} fingerprintDetails - Fingerprint details (time, location, squad info)
 */
function displayResults(courtDate, fingerprintDate, courtDetails, fingerprintDetails) {
  // Display court information
  document.getElementById("court-date").textContent = formatDate(courtDate);
  document.getElementById("court-time").textContent = courtDetails.time;
  document.getElementById("court-address").textContent = courtDetails.address;
  
  const noteElement = document.getElementById("court-note");
  const noteSection = document.getElementById("note-section");
  if (noteElement && noteSection) {
    if (courtDetails.note) {
      noteElement.textContent = courtDetails.note;
      noteSection.style.display = "block";
    } else {
      noteSection.style.display = "none";
    }
  }

  // Display fingerprint information
  document.getElementById("fingerprint-date").textContent = formatDate(fingerprintDate);
  document.getElementById("fingerprint-time").textContent = fingerprintDetails.time;
  document.getElementById("fingerprint-location").textContent = fingerprintDetails.location;
  
  const fpLocationElement = document.getElementById("fingerprint-location");
  if (fpLocationElement) {
    // Remove any existing notes
    const existingNote = fpLocationElement.parentNode.querySelector(".note");
    if (existingNote) {
      fpLocationElement.parentNode.removeChild(existingNote);
    }

    // Create the fingerprint info section
    const fpInfoDiv = document.createElement("div");
    fpInfoDiv.className = "note"; // Use consistent neutral styling
    fpInfoDiv.style.marginTop = "15px";

    // Selection reason
    if (fingerprintDetails.reasonText) {
      const reasonContent = document.createElement("div");
      reasonContent.className = "info-value";
      reasonContent.style.marginBottom = "8px";
      reasonContent.innerHTML = `<strong>Selection:</strong> ${fingerprintDetails.reasonText}`;
      fpInfoDiv.appendChild(reasonContent);
    }

    // Squad information
    const squadInfoContent = document.createElement("div");
    squadInfoContent.className = "info-value";
    squadInfoContent.innerHTML = `<strong>Squad Working:</strong> ${fingerprintDetails.squadInfo}`;
    fpInfoDiv.appendChild(squadInfoContent);

    // Holiday warning if applicable
    if (fingerprintDetails.isHoliday) {
      const holidayWarning = document.createElement("div");
      holidayWarning.className = "info-value";
      holidayWarning.style.marginTop = "8px";
      holidayWarning.style.color = "#e74c3c";
      holidayWarning.style.fontWeight = "bold";
      holidayWarning.innerHTML = `⚠️ <strong>HOLIDAY DATE:</strong> Verify office availability`;
      fpInfoDiv.appendChild(holidayWarning);
    }

    fpLocationElement.parentNode.appendChild(fpInfoDiv);
  }
  
  // Update copy content
  document.getElementById("copy-content").innerText = fingerprintDetails.copyText;
  
  // Show results
  document.getElementById("results").style.display = "block";
  
  // Scroll to results
  document.getElementById("results").scrollIntoView({ behavior: 'smooth', block: 'start' });
}