/**
 * main.js - Contains the main functionality
 * Fixed date calculation algorithm to properly select the closest appropriate weekday.
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
  
  if (city === "richmond") {
    const nameGroup = /^[A-K]$/i.test(initial) ? "A-K" : "L-Z";
    courtDate = findClosestDate(weeksOut, richmondCourtDates[nameGroup]);
  }
  else {
    let courtWeekday;
    const youthCase = caseType === "youth";

    if (city === "new-westminster") {
      courtWeekday = 3;
    } else if (city === "surrey" && youthCase) {
      courtWeekday = 3;
    } else if (city === "surrey") {
      if (/^[A-C]$/.test(initial)) {
        courtWeekday = 1;
      } else if (/^[D-H]$/.test(initial)) {
        courtWeekday = 2;
      } else if (/^[I-L]$/.test(initial)) {
        courtWeekday = 3;
      } else if (/^[M-R]$/.test(initial)) {
        courtWeekday = 4;
      } else if (/^[S-Z]$/.test(initial)) {
        courtWeekday = 5;
      } else {
        showAlert("Please enter a valid letter (A-Z).");
        return;
      }
    } else if ((city === "vancouver" || city === "burnaby") && youthCase) {
      courtWeekday = 4;
    } else if (city === "vancouver" || city === "burnaby") {
      if (/^[A-F]$/.test(initial)) {
        courtWeekday = 1;
      } else if (/^[G-L]$/.test(initial)) {
        courtWeekday = 2;
      } else if (/^[M-R]$/.test(initial)) {
        courtWeekday = 3;
      } else if (/^[S-Z]$/.test(initial)) {
        courtWeekday = 4;
      } else {
        showAlert("Please enter a valid letter (A-Z).");
        return;
      }
    } else if (city === "coquitlam") {
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + weeksOut * 7);

      const targetDay = targetDate.getDay();
      if (targetDay === 0) {
        courtWeekday = 1;
      } else if (targetDay === 6) {
        courtWeekday = 1;
      } else {
        courtWeekday = targetDay;
      }
    } else if (city === "north-vancouver") {
      if (caseType === "youth") {
        courtWeekday = 1;
      } else {
        courtWeekday = 3;
      }
    }

    const today = new Date();
    courtDate = new Date(today);
    courtDate.setDate(today.getDate() + weeksOut * 7);

    const targetWeekday = courtDate.getDay();
    const dayDiff = courtWeekday - targetWeekday;

    // FIXED ALGORITHM for more intuitive date selection:
    // 1. If we're already on the right day, keep it
    // 2. If we're 1-3 days away in either direction, pick the closest occurrence
    // 3. If we're 4+ days away, pick the closest occurrence in the opposite direction

    if (dayDiff === 0) {
    } else if (dayDiff > 0 && dayDiff <= 3) {
      // 1-3 days forward, use the next occurrence
      courtDate.setDate(courtDate.getDate() + dayDiff);
    } else if (dayDiff < 0 && dayDiff >= -3) {
      // 1-3 days backward, use the previous occurrence
      courtDate.setDate(courtDate.getDate() + dayDiff);
    } else if (dayDiff > 0) {
      // 4+ days forward, prefer the previous occurrence
      courtDate.setDate(courtDate.getDate() + (dayDiff - 7));
    } else {
      // 4+ days backward, prefer the next occurrence
      courtDate.setDate(courtDate.getDate() + (dayDiff + 7));
    }

    // Check if the court date lands on a holiday
    if (isHoliday(courtDate)) {
      courtDate.setDate(courtDate.getDate() + 7);
      while (isHoliday(courtDate)) {
        courtDate.setDate(courtDate.getDate() + 7);
      }
    }
  }

  if (!courtDate || isNaN(courtDate.getTime())) {
    showAlert(
      "Error: Invalid date calculated. Please try different parameters."
    );
    return;
  }

  const fingerprintDate = findBestFingerprintDate(courtDate, squad);
  const workingSquads = getWorkingSquads(fingerprintDate);
  const isIssuingDaySquad = squad === "A" || squad === "C";
  const fingerprintTime = isIssuingDaySquad ? "0900hrs" : "1800hrs";
  const fingerprintSquad = isIssuingDaySquad ? workingSquads.day : workingSquads.night;
  const isMatchingSquad = fingerprintSquad === squad;
  const squadInfo = isMatchingSquad
    ? `${fingerprintSquad} Squad (issuing squad)`
    : `${fingerprintSquad} Squad (not issuing squad)`;

  let courtDetails = {
    time: "",
    address: "",
    note: ""
  };

  if (city === "richmond") {
    courtDetails = {
      time: "0900hrs",
      address: "Richmond Provincial Court: 7577 Elmbridge Way, Richmond, BC V6X 4J2",
      note: ""
    };

    const isAKDate = richmondCourtDates["A-K"].some(
      (date) =>
        date.getDate() === courtDate.getDate() &&
        date.getMonth() === courtDate.getMonth() &&
        date.getFullYear() === courtDate.getFullYear()
    );

    const rotation = isAKDate ? "A-K" : "L-Z";
    courtDetails.note = `This date is for last names ${rotation}.`;

    if (caseType === "youth") {
      courtDetails.note += " Youth attend the same court.";
    }
  } else {
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

      courtDetails = {
        time: "0900hrs",
        address: `${city.charAt(0).toUpperCase() + city.slice(1)} Provincial Court`,
        note: "Please verify court room details."
      };
    }
  }

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

  let copyText = `Court date: ${courtDay} ${courtMonth} ${courtDayNum} ${courtYear} at ${courtDetails.time} - ${courtDetails.address}`;
  
  if (city === "new-westminster") {
    copyText += ` (Client needs to check docket for court room number.)`;
  }
  
  copyText += ` // Fingerprint date: ${fpDay} ${fpMonth} ${fpDayNum} ${fpYear} at ${fingerprintTime} - ${fingerprintInfo.location}`;

  const fingerprintDetails = {
    time: fingerprintTime,
    location: fingerprintInfo.location,
    squadInfo: squadInfo, 
    isMatchingSquad: isMatchingSquad, 
    copyText: copyText
  };

  displayResults(courtDate, fingerprintDate, courtDetails, fingerprintDetails);
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