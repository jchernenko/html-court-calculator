/**
 * main.js - Contains the main functionality
 * Refactored to use centralized court data and simplified logic.
 * Updated Surrey logic to allow any Monday-Friday scheduling.
 */

/**
 * Calculate court and fingerprint dates
 */
function calculateDates() {
  const city = document.getElementById("city").value;
  const initial = document.getElementById("initial").value.toUpperCase();
  const weeksOut = parseInt(document.getElementById("weeks").value);
  const squad = document.getElementById("squad").value;
  const caseType = document.getElementById("case-type").value;

  // Validation
  if (city === "choose") {
    showAlert("Please select a court city.");
    return;
  }

  if (isNaN(weeksOut) || weeksOut < 1 || weeksOut > 52) {
    showAlert("Please enter a valid number of weeks (1-52).");
    return;
  }

  // Get court configuration
  const courtConfig = courtInfo[city][caseType];
  if (!courtConfig) {
    showAlert("Invalid city or case type configuration.");
    return;
  }

  // Check if initial is required
  if (courtConfig.dayType === "surname" || courtConfig.dayType === "calendar") {
    if (!initial) {
      showAlert("Please enter the first letter of the last name.");
      return;
    }
  }

  // Calculate court date based on court type
  let courtDate = calculateCourtDate(city, caseType, initial, weeksOut, courtConfig);

  if (!courtDate || isNaN(courtDate.getTime())) {
    showAlert("Error: Invalid date calculated. Please try different parameters.");
    return;
  }

  // Calculate fingerprint date using simplified logic
  const fingerprintResult = calculateFingerprintDate(courtDate, squad);

  // Prepare court details
  let courtDetails = {
    time: courtConfig.time,
    address: courtConfig.address,
    note: courtConfig.note || ""
  };

  // Add specific notes for Richmond
  if (city === "richmond") {
    const nameGroup = /^[A-K]$/i.test(initial) ? "A-K" : "L-Z";
    const isAKDate = richmondCourtDates["A-K"].some(
      (date) =>
        date.getDate() === courtDate.getDate() &&
        date.getMonth() === courtDate.getMonth() &&
        date.getFullYear() === courtDate.getFullYear()
    );
    const rotation = isAKDate ? "A-K" : "L-Z";
    
    // Combine the calendar link with rotation info
    let richmondNote = courtConfig.note; // Get the note with calendar link from data.js
    richmondNote += `This date is for last names ${rotation}.`;
    
    if (caseType === "youth") {
      richmondNote += " Youth attend the same court.";
    }
    
    courtDetails.note = richmondNote;
  }

  // Prepare fingerprint details
  const fingerprintDetails = {
    time: fingerprintResult.time,
    location: fingerprintResult.location,
    isHoliday: fingerprintResult.isHoliday,
    daysBefore: fingerprintResult.daysBefore
  };

  // Create copy text
  const copyText = createCopyText(courtDate, fingerprintResult, courtDetails, fingerprintDetails);
  fingerprintDetails.copyText = copyText;

  displayResults(courtDate, fingerprintResult.date, courtDetails, fingerprintDetails);
}

/**
 * Calculate court date based on court configuration
 */
function calculateCourtDate(city, caseType, initial, weeksOut, courtConfig) {
  const today = new Date();
  const targetDate = new Date(today.getTime() + (weeksOut * 7 * 24 * 60 * 60 * 1000));
  let courtDate;

  switch (courtConfig.dayType) {
    case "calendar":
      // Richmond uses specific calendar dates
      const nameGroup = /^[A-K]$/i.test(initial) ? "A-K" : "L-Z";
      courtDate = findClosestDate(weeksOut, richmondCourtDates[nameGroup]);
      break;

    case "fixed":
      // Fixed day of week (e.g., always Wednesday)
      courtDate = getNextWeekday(targetDate, courtConfig.fixedDay);
      break;

    case "surname":
      // Day based on surname letter
      const dayOfWeek = getSurnameDay(initial, courtConfig.dayRules);
      courtDate = getNextWeekday(targetDate, dayOfWeek);
      break;

    case "flexible":
      // Multiple possible days - choose closest to target
      courtDate = getClosestWeekday(targetDate, courtConfig.possibleDays);
      break;

    default:
      // Fallback - use target date if it's a weekday, otherwise next Monday
      courtDate = new Date(targetDate);
      if (courtDate.getDay() === 0 || courtDate.getDay() === 6) {
        courtDate = getNextWeekday(courtDate, 1); // Next Monday
      }
  }

  // Handle holidays
  courtDate = handleHolidays(courtDate, courtConfig);

  return courtDate;
}

/**
 * Handle court dates that fall on holidays
 */
function handleHolidays(courtDate, courtConfig) {
  let adjustedDate = new Date(courtDate);
  
  while (isHoliday(adjustedDate)) {
    if (courtConfig.dayType === "calendar") {
      // For calendar-based (Richmond), move to next week's date
      adjustedDate.setDate(adjustedDate.getDate() + 7);
    } else if (courtConfig.dayType === "fixed") {
      // For fixed day, move to next week
      adjustedDate.setDate(adjustedDate.getDate() + 7);
    } else if (courtConfig.dayType === "surname") {
      // For surname-based, move to next week same day
      adjustedDate.setDate(adjustedDate.getDate() + 7);
    } else if (courtConfig.dayType === "flexible") {
      // For flexible scheduling, try next available day
      adjustedDate = getNextAvailableDay(adjustedDate, courtConfig.possibleDays);
    }
  }
  
  return adjustedDate;
}

/**
 * Get next available day that's not a holiday
 */
function getNextAvailableDay(currentDate, possibleDays) {
  let testDate = new Date(currentDate);
  
  // Try next 14 days to find a non-holiday day that's in possibleDays
  for (let i = 1; i <= 14; i++) {
    testDate.setDate(currentDate.getDate() + i);
    if (possibleDays.includes(testDate.getDay()) && !isHoliday(testDate)) {
      return new Date(testDate);
    }
  }
  
  // Fallback - just add 7 days
  return new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
}

/**
 * Create copy/paste text
 */
function createCopyText(courtDate, fingerprintResult, courtDetails, fingerprintDetails) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const courtDay = days[courtDate.getDay()];
  const courtMonth = months[courtDate.getMonth()];
  const courtDayNum = courtDate.getDate();
  const courtYear = courtDate.getFullYear();

  const fpDay = days[fingerprintResult.date.getDay()];
  const fpMonth = months[fingerprintResult.date.getMonth()];
  const fpDayNum = fingerprintResult.date.getDate();
  const fpYear = fingerprintResult.date.getFullYear();

  let copyText = `Court date: ${courtDay} ${courtMonth} ${courtDayNum} ${courtYear} at ${courtDetails.time} - ${courtDetails.address}`;
  copyText += ` // Fingerprint date: ${fpDay} ${fpMonth} ${fpDayNum} ${fpYear} at ${fingerprintResult.time} - ${fingerprintResult.location}`;

  // Add holiday warning if applicable
  if (fingerprintDetails.isHoliday) {
    copyText += ` (HOLIDAY DATE - verify availability)`;
  }

  return copyText;
}

/**
 * Save operator notes
 */
function saveOperatorNotes() {
  const notes = document.getElementById("operator-notes-textarea").value;
  localStorage.setItem("operatorNotes", notes);
  
  const saveButton = document.getElementById("save-notes-button");
  const originalText = saveButton.textContent;
  saveButton.textContent = "Saved!";
  saveButton.style.backgroundColor = "#2ecc71";
  
  setTimeout(() => {
    saveButton.textContent = originalText;
    saveButton.style.backgroundColor = "#3498db";
  }, 2000);
}

/**
 * Load operator notes from local storage
 */
function loadOperatorNotes() {
  const notes = localStorage.getItem("operatorNotes") || "";
  document.getElementById("operator-notes-textarea").value = notes;
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("case-type").addEventListener("change", toggleInitialField);
  document.getElementById("city").addEventListener("change", toggleInitialField);
  
  toggleInitialField();
  loadOperatorNotes();

  const saveButton = document.getElementById("save-notes-button");
  if (saveButton) {
    saveButton.addEventListener("click", saveOperatorNotes);
  }
});