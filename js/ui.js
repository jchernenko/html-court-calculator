/**
 * ui.js - Contains UI-related functions
 * This file handles UI interactions, alerts, and display functions.
 * Updated to work with refactored centralized data structure.
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
  const caseTypeLabel = document.querySelector('label[for="case-type"]');

  // Check if court configuration exists and requires initial
  let requiresInitial = false;
  let placeholderText = "Not required";
  
  if (city !== "choose" && courtInfo[city] && courtInfo[city][caseType]) {
    const courtConfig = courtInfo[city][caseType];
    requiresInitial = (courtConfig.dayType === "surname" || courtConfig.dayType === "calendar");
  }

  if (requiresInitial) {
    initialField.disabled = false;
    initialField.classList.remove("disabled-field");
    initialField.placeholder = "Enter first letter";

    // Special case for Richmond youth
    if (city === "richmond" && caseType === "youth") {
      caseTypeLabel.innerHTML =
        'Case Type: <small style="font-weight:normal;color:#666;">(Richmond youth follow the same schedule as adults)</small>';
    } else {
      caseTypeLabel.innerHTML = "Case Type:";
    }
  } else {
    initialField.disabled = true;
    initialField.classList.add("disabled-field");
    
    // Set appropriate placeholder text
    if (caseType === "youth" && city !== "richmond") {
      placeholderText = "Not required for Youth";
    } else if (city === "new-westminster") {
      placeholderText = "Not required for New Westminster";
    } else if (city === "coquitlam") {
      placeholderText = "Not required for Coquitlam";
    } else if (city === "north-vancouver") {
      placeholderText = "Not required for North Vancouver";
    } else if (city === "surrey") {
      placeholderText = "Not required for Surrey";
    }
    
    initialField.placeholder = placeholderText;
    initialField.value = "";
    caseTypeLabel.innerHTML = "Case Type:";
  }
}

/**
 * Display the calculated dates in the UI
 * @param {Date} courtDate - Court date
 * @param {Date} fingerprintDate - Fingerprint date
 * @param {Object} courtDetails - Court details (time, address, note)
 * @param {Object} fingerprintDetails - Fingerprint details (time, location, etc.)
 */
function displayResults(courtDate, fingerprintDate, courtDetails, fingerprintDetails) {
  // Display court information
  document.getElementById("court-date").textContent = formatDate(courtDate);
  document.getElementById("court-time").textContent = courtDetails.time;
  document.getElementById("court-address").textContent = courtDetails.address;
  
  // Hide court notes section
  const noteSection = document.getElementById("note-section");
  if (noteSection) {
    noteSection.style.display = "none";
  }

  // Display fingerprint information
  document.getElementById("fingerprint-date").textContent = formatDate(fingerprintDate);
  document.getElementById("fingerprint-time").textContent = fingerprintDetails.time;
  document.getElementById("fingerprint-location").textContent = fingerprintDetails.location;
  
  // Remove any existing fingerprint notes
  const fpLocationElement = document.getElementById("fingerprint-location");
  if (fpLocationElement) {
    const existingNote = fpLocationElement.parentNode.querySelector(".note");
    if (existingNote) {
      fpLocationElement.parentNode.removeChild(existingNote);
    }
  }
  
  // Update copy content
  document.getElementById("copy-content").innerText = fingerprintDetails.copyText;
  
  // Show results
  document.getElementById("results").style.display = "block";
  
  // Scroll to results
  document.getElementById("results").scrollIntoView({ behavior: 'smooth', block: 'start' });
}