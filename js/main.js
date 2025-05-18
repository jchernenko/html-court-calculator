/**
 * main.js - Contains the main functionality
 * Added Operator Notes section and removed test button.
 */

/**
 * Calculate court and fingerprint dates
 */
function calculateDates() {
  // Get input values
  const city = document.getElementById("city").value;
  const initial = document.getElementById("initial").value.toUpperCase();
  const weeksOut = parseInt(document.getElementById("weeks").value);
  const squad = document.getElementById("squad").value;
  const caseType = document.getElementById("case-type").value;

  // Validate inputs
  if (
    caseType === "adult" &&
    city !== "new-westminster" &&
    city !== "richmond" &&
    city !== "coquitlam" &&
    city !== "north-vancouver" &&
    !initial
  ) {
    showAlert("Please enter the first letter of the last name.");
    return;
  }

  if (city === "richmond" && !initial) {
    showAlert("Please enter the first letter of the last name.");
    return;
  }

  if (city === "choose") {
    showAlert("Please select a court city.");
    return;
  }

  if (isNaN(weeksOut) || weeksOut < 1 || weeksOut > 52) {
    showAlert("Please enter a valid number of weeks (1-52).");
    return;
  }

  let courtDate;
  
  // SPECIAL HANDLING FOR RICHMOND
  if (city === "richmond") {
    // For Richmond, find the closest date that matches the last name group
    const nameGroup = /^[A-K]$/i.test(initial) ? "A-K" : "L-Z";
    courtDate = findClosestDate(weeksOut, richmondCourtDates[nameGroup]);
  }
  // REGULAR HANDLING FOR OTHER CITIES
  else {
    // Determine court day based on city, initial and case type
    let courtWeekday;
    const youthCase = caseType === "youth";

    if (city === "new-westminster") {
      // New Westminster is always Wednesday, regardless of last name
      courtWeekday = 3; // Wednesday
    } else if (city === "surrey" && youthCase) {
      // Surrey youth cases are always on Wednesday
      courtWeekday = 3; // Wednesday
    } else if (city === "surrey") {
      // Surrey adult cases follow this schedule
      if (/^[A-C]$/.test(initial)) {
        courtWeekday = 1; // Monday
      } else if (/^[D-H]$/.test(initial)) {
        courtWeekday = 2; // Tuesday
      } else if (/^[I-L]$/.test(initial)) {
        courtWeekday = 3; // Wednesday
      } else if (/^[M-R]$/.test(initial)) {
        courtWeekday = 4; // Thursday
      } else if (/^[S-Z]$/.test(initial)) {
        courtWeekday = 5; // Friday
      } else {
        showAlert("Please enter a valid letter (A-Z).");
        return;
      }
    } else if ((city === "vancouver" || city === "burnaby") && youthCase) {
      // Youth cases for Vancouver or Burnaby are always on Thursday
      courtWeekday = 4; // Thursday
    } else if (city === "vancouver" || city === "burnaby") {
      // Adult cases follow the letter schedule
      if (/^[A-F]$/.test(initial)) {
        courtWeekday = 1; // Monday
      } else if (/^[G-L]$/.test(initial)) {
        courtWeekday = 2; // Tuesday
      } else if (/^[M-R]$/.test(initial)) {
        courtWeekday = 3; // Wednesday
      } else if (/^[S-Z]$/.test(initial)) {
        courtWeekday = 4; // Thursday
      } else {
        showAlert("Please enter a valid letter (A-Z).");
        return;
      }
    } else if (city === "coquitlam") {
      // For Coquitlam, find the closest weekday (Mon-Fri)
      // to the target date 6 weeks from today
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + weeksOut * 7);

      // If target date falls on a weekend, adjust to Monday after
      const targetDay = targetDate.getDay();
      if (targetDay === 0) {
        // Sunday
        courtWeekday = 1; // Use Monday
      } else if (targetDay === 6) {
        // Saturday
        courtWeekday = 1; // Use Monday
      } else {
        // Use the actual weekday (1-5)
        courtWeekday = targetDay;
      }
    } else if (city === "north-vancouver") {
      // North Vancouver - different days for adult and youth
      if (caseType === "youth") {
        courtWeekday = 1; // Monday for youth
      } else {
        courtWeekday = 3; // Wednesday for adult
      }
    }

    // Calculate the court date - IMPROVED ALGORITHM
    const today = new Date();
    courtDate = new Date(today);

    // Add weeks to get the target date
    courtDate.setDate(today.getDate() + weeksOut * 7);

    // Find the appropriate occurrence of the desired weekday
    const targetWeekday = courtDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayDiff = courtWeekday - targetWeekday;

    // Modified algorithm for more intuitive date selection:
    // 1. If we're already on the right day, keep it
    // 2. If we're 1-2 days away, pick the closest occurrence
    // 3. If we're 3+ days away, prefer the next occurrence rather than the previous

    if (dayDiff === 0) {
      // Already on the correct weekday, no adjustment needed
    } else if (dayDiff > 0 && dayDiff <= 2) {
      // 1-2 days forward, use the next occurrence
      courtDate.setDate(courtDate.getDate() + dayDiff);
    } else if (dayDiff < 0 && dayDiff >= -2) {
      // 1-2 days backward, use the previous occurrence
      courtDate.setDate(courtDate.getDate() + dayDiff);
    } else if (dayDiff > 0) {
      // 3+ days forward, prefer the previous occurrence
      courtDate.setDate(courtDate.getDate() + (dayDiff - 7));
    } else {
      // 3+ days backward, prefer the next occurrence
      courtDate.setDate(courtDate.getDate() + (dayDiff + 7));
    }

    // Check if the court date lands on a holiday
    if (isHoliday(courtDate)) {
      // Move to next valid court day (same weekday next week)
      courtDate.setDate(courtDate.getDate() + 7);
      while (isHoliday(courtDate)) {
        courtDate.setDate(courtDate.getDate() + 7);
      }
    }
  }

  // Ensure courtDate is a valid date before proceeding
  if (!courtDate || isNaN(courtDate.getTime())) {
    showAlert(
      "Error: Invalid date calculated. Please try different parameters."
    );
    return;
  }

  // Calculate fingerprint date using squad-based scheduling
  const fingerprintDate = findBestFingerprintDate(courtDate, squad);

  // Get working squads for the fingerprint date
  const workingSquads = getWorkingSquads(fingerprintDate);

  // Determine if issuing squad is day or night squad
  const isIssuingDaySquad = squad === "A" || squad === "C";
  
  // Set fingerprint time based on whether issuing squad is a day or night squad
  const fingerprintTime = isIssuingDaySquad ? "0900hrs" : "1800hrs";
  
  // Get fingerprint squad
  const fingerprintSquad = isIssuingDaySquad ? workingSquads.day : workingSquads.night;
  
  // Check if fingerprint squad matches issuing squad
  const isMatchingSquad = fingerprintSquad === squad;
  const squadInfo = isMatchingSquad
    ? `${fingerprintSquad} Squad (issuing squad)`
    : `${fingerprintSquad} Squad (not issuing squad)`;

  // Get court information based on city and case type
  let courtDetails = {
    time: "",
    address: "",
    note: ""
  };

  // Handle Richmond's special case
  if (city === "richmond") {
    courtDetails = {
      time: "0900hrs",
      address: "Richmond Provincial Court: 7577 Elmbridge Way, Richmond, BC V6X 4J2",
      note: ""
    };

    // Determine if this is an A-K or L-Z date
    const isAKDate = richmondCourtDates["A-K"].some(
      (date) =>
        date.getDate() === courtDate.getDate() &&
        date.getMonth() === courtDate.getMonth() &&
        date.getFullYear() === courtDate.getFullYear()
    );

    const rotation = isAKDate ? "A-K" : "L-Z";
    courtDetails.note = `This date is for last names ${rotation}.`;

    // Add note for youth
    if (caseType === "youth") {
      courtDetails.note += " Youth attend the same court.";
    }
  } else {
    // Use court information directly from the data.js object
    if (city === "vancouver" && caseType === "adult") {
      courtDetails = {
        time: "1400hrs",
        address: "Vancouver Provincial Court: Courtroom 307 - 222 Main Street, Vancouver, BC V6A 2S8",
        note: "This court covers Vancouver and Burnaby."
      };
    } else if (city === "vancouver" && caseType === "youth") {
      courtDetails = {
        time: "0930hrs",
        address: "Vancouver Provincial Court: Courtroom 101 - 800 Hornby Street, Vancouver, BC V6Z 2C5",
        note: "This court covers Vancouver and Burnaby."
      };
    } else if (city === "burnaby" && caseType === "adult") {
      courtDetails = {
        time: "1330hrs",
        address: "Vancouver Provincial Court: Courtroom 307 - 222 Main Street, Vancouver, BC V6A 2S8",
        note: "This court covers Vancouver and Burnaby."
      };
    } else if (city === "burnaby" && caseType === "youth") {
      courtDetails = {
        time: "0930hrs",
        address: "Vancouver Provincial Court: Courtroom 101 - 800 Hornby Street, Vancouver, BC V6Z 2C5",
        note: "This court covers Vancouver and Burnaby."
      };
    } else if (city === "surrey" && caseType === "adult") {
      courtDetails = {
        time: "0900hrs",
        address: "Surrey Provincial Court: Courtroom 100 - 14340 57th Ave, Surrey, BC V3X 1B2",
        note: "This court covers Surrey, Delta, Langley & White Rock."
      };
    } else if (city === "surrey" && caseType === "youth") {
      courtDetails = {
        time: "0930hrs",
        address: "Surrey Provincial Court: Courtroom 312 - 14340 57th Ave, Surrey, BC V3X 1B2",
        note: "This court covers Surrey, Delta, Langley & White Rock."
      };
    } else if (city === "new-westminster") {
      courtDetails = {
        time: "0900hrs",
        address: "New Westminster Law Courts: 651 Carnarvon Street, New Westminster, BC V3M 1C9",
        note: "Client needs to check docket for court room number."
      };
    } else if (city === "coquitlam") {
      courtDetails = {
        time: "1400hrs",
        address: "Port Coquitlam Provincial Court: 2620 Mary Hill Rd, Port Coquitlam, BC V3C 3B2",
        note: "This court covers Coquitlam, Port Coquitlam, Port Moody, Pitt Meadows & Maple Ridge."
      };
    } else if (city === "north-vancouver" && caseType === "adult") {
      courtDetails = {
        time: "0900hrs",
        address: "North Vancouver Provincial Court: Courtroom 2 - 200 East 23rd Ave, North Vancouver, BC V7L 4R4",
        note: "This court covers North Vancouver and West Vancouver."
      };
    } else if (city === "north-vancouver" && caseType === "youth") {
      courtDetails = {
        time: "0930hrs",
        address: "North Vancouver Provincial Court: Courtroom 2 - 200 East 23rd Ave, North Vancouver, BC V7L 4R4",
        note: "This court covers North Vancouver and West Vancouver."
      };
    } else {
      // Fallback for any missing data
      courtDetails = {
        time: "0900hrs",
        address: `${city.charAt(0).toUpperCase() + city.slice(1)} Provincial Court`,
        note: "Please verify court room details."
      };
    }
  }

  // Generate copy text
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const courtDay = days[courtDate.getDay()];
  const courtMonth = months[courtDate.getMonth()];
  const courtDayNum = courtDate.getDate();
  const courtYear = courtDate.getFullYear();

  const fpDay = days[fingerprintDate.getDay()];
  const fpMonth = months[fingerprintDate.getMonth()];
  const fpDayNum = fingerprintDate.getDate();
  const fpYear = fingerprintDate.getFullYear();

  // Create copy text - Add special case for New Westminster to include the note
  let copyText = `Court date: ${courtDay} ${courtMonth} ${courtDayNum} ${courtYear} at ${courtDetails.time} - ${courtDetails.address}`;
  
  // Add New Westminster note to copy text if applicable
  if (city === "new-westminster") {
    copyText += ` (Client needs to check docket for court room number.)`;
  }
  
  // Add fingerprint info
  copyText += ` // Fingerprint date: ${fpDay} ${fpMonth} ${fpDayNum} ${fpYear} at ${fingerprintTime} - ${fingerprintInfo.location}`;

  // Prepare fingerprint details
  const fingerprintDetails = {
    time: fingerprintTime,
    location: fingerprintInfo.location,
    squadInfo: squadInfo,  // Keep this for the UI display
    isMatchingSquad: isMatchingSquad,  // Keep this for UI styling
    copyText: copyText  // This now includes the New Westminster note for copy/paste
  };

  // Display the results
  displayResults(courtDate, fingerprintDate, courtDetails, fingerprintDetails);
}

/**
 * Save operator notes
 */
function saveOperatorNotes() {
  const notes = document.getElementById("operator-notes-textarea").value;
  localStorage.setItem("operatorNotes", notes);
  
  // Show saved confirmation
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

// Initialize event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Add event listeners to case type and city dropdowns
  document.getElementById("case-type").addEventListener("change", toggleInitialField);
  document.getElementById("city").addEventListener("change", toggleInitialField);
  
  // Initialize the form
  toggleInitialField();
  
  // Initialize operator notes
  loadOperatorNotes();
  
  // Add event listener to save notes button
  const saveButton = document.getElementById("save-notes-button");
  if (saveButton) {
    saveButton.addEventListener("click", saveOperatorNotes);
  }
});