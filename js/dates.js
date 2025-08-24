/**
 * dates.js - Contains date calculation functions
 * This file handles all date manipulation for court and fingerprint dates.
 * Fixed squad rotation calculation.
 */

/**
 * Check if a date is a holiday
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is a holiday
 */
function isHoliday(date) {
  return holidays.some(
    (holiday) =>
      holiday.getDate() === date.getDate() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
  );
}

/**
 * Check if a date is a weekend
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is a weekend
 */
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Format date as a readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "Monday, May 17, 2025")
 */
function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-CA", options);
}

/**
 * Find the closest date in a list to a target date
 * @param {number} targetWeeksOut - Weeks from now to target
 * @param {Date[]} dateList - List of dates to search
 * @returns {Date} Closest date from the list
 */
function findClosestDate(targetWeeksOut, dateList) {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + targetWeeksOut * 7);

  let closestDate = null;
  let minDiff = Number.MAX_VALUE;

  for (const date of dateList) {
    const diff = Math.abs(date - targetDate);
    if (diff < minDiff) {
      minDiff = diff;
      closestDate = date;
    }
  }

  return closestDate;
}

/**
 * Determine which squads are working on a given date
 * @param {Date} date - Date to check
 * @returns {Object} Object with day and night squads
 */
function getWorkingSquads(date) {
  const referenceDate = new Date(2025, 3, 28);
  const oneDay = 24 * 60 * 60 * 1000;
  const dayDifference = Math.round((date - referenceDate) / oneDay);
  const adjustedDifference = ((dayDifference % 8) + 8) % 8;

  if (adjustedDifference < 4) {
    return {
      day: "A",
      night: "B",
    };
  } else {
    return {
      day: "C",
      night: "D", 
    };
  }
}

/**
 * Find the best fingerprint dates based on court day and simple day-based rules
 * @param {Date} courtDate - Court date
 * @param {string} issuingSquad - Issuing squad (A, B, C, or D)
 * @returns {Array} Array of fingerprint date options with priority rankings
 */
function findBestFingerprintDates(courtDate, issuingSquad) {
  const isNightSquad = issuingSquad === "B" || issuingSquad === "D";
  const courtDayOfWeek = courtDate.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  
  // Determine optimal fingerprint day based on court day (at least 2 days before)
  let optimalFingerprintDay;
  if (courtDayOfWeek === 1 || courtDayOfWeek === 2 || courtDayOfWeek === 3) { // Monday, Tuesday, or Wednesday
    optimalFingerprintDay = 4; // Thursday before
  } else if (courtDayOfWeek === 4) { // Thursday
    optimalFingerprintDay = 2; // Tuesday before (2 days)
  } else if (courtDayOfWeek === 5) { // Friday
    optimalFingerprintDay = 3; // Wednesday before (2 days)
  } else {
    // Weekend court dates (shouldn't happen, but fallback to Thursday)
    optimalFingerprintDay = 4;
  }
  
  const potentialDates = [];
  const validDays = [2, 3, 4]; // Tue, Wed, Thu
  
  // Find all valid fingerprint dates within reasonable range
  for (let i = 1; i <= 15; i++) { // Look up to 15 days back to ensure we find options
    const testDate = new Date(courtDate);
    testDate.setDate(courtDate.getDate() - i);
    
    // Skip weekends
    if (testDate.getDay() === 0 || testDate.getDay() === 6) {
      continue;
    }
    
    // Only consider Tuesday, Wednesday, Thursday (days 2, 3, 4)
    const dayOfWeek = testDate.getDay();
    if (!validDays.includes(dayOfWeek)) {
      continue;
    }
    
    const workingSquads = getWorkingSquads(testDate);
    
    let squadMatch = false;
    let workingSquad = "";
    if (isNightSquad) {
      squadMatch = workingSquads.night === issuingSquad;
      workingSquad = workingSquads.night;
    } else {
      squadMatch = workingSquads.day === issuingSquad;
      workingSquad = workingSquads.day;
    }
    
    // Mark if this is the optimal day based on court day rules
    const isOptimalDay = dayOfWeek === optimalFingerprintDay;
    
    potentialDates.push({
      date: new Date(testDate),
      squadMatch: squadMatch,
      workingSquad: workingSquad,
      daysBefore: i,
      isHoliday: isHoliday(testDate),
      day: testDate.getDay(),
      isOptimalDay: isOptimalDay
    });
  }
  
  // Sort by new priority:
  // 1. Optimal day based on court day rules (closest first)
  // 2. Other valid days (closest to court date first)
  // 3. Non-holidays preferred over holidays
  
  potentialDates.sort((a, b) => {
    // First priority: Optimal day vs other days
    if (a.isOptimalDay !== b.isOptimalDay) {
      return a.isOptimalDay ? -1 : 1; // Optimal days come first
    }
    
    // Second priority: Closer to court date
    if (a.daysBefore !== b.daysBefore) {
      return a.daysBefore - b.daysBefore;
    }
    
    // Third priority: Non-holidays preferred over holidays
    if (a.isHoliday !== b.isHoliday) {
      return a.isHoliday ? 1 : -1;
    }
    
    return 0;
  });
  
  // Take the top 3 and add priority ranking
  const rankedDates = potentialDates.slice(0, 3).map((dateObj, index) => ({
    ...dateObj,
    priority: index + 1,
    isOptimal: index === 0
  }));
  
  return rankedDates;
}

/**
 * Legacy function for backward compatibility - returns just the optimal date
 * @param {Date} courtDate - Court date
 * @param {string} issuingSquad - Issuing squad (A, B, C, or D)
 * @returns {Date} Optimal fingerprint date
 */
function findBestFingerprintDate(courtDate, issuingSquad) {
  const options = findBestFingerprintDates(courtDate, issuingSquad);
  return options.length > 0 ? options[0].date : new Date(courtDate.getTime() - 2 * 24 * 60 * 60 * 1000);
}

/**
 * Check if a date is a valid fingerprint day
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is a valid fingerprint day
 */
function isValidFingerprintDay(date) {
  const day = date.getDay();
  return day >= 2 && day <= 4;
}