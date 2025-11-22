/**
 * dates.js - Contains date calculation functions
 * This file handles all date manipulation for court and fingerprint dates.
 *
 * Fingerprint Rules:
 * - Fingerprints are scheduled 1 business day prior to court date
 * - Valid fingerprint days: Monday-Friday (excluding holidays)
 * - Time: 0900hrs for squads A/C, 1800hrs for squads B/D
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
 * Check if a date is a court closure date (general or city-specific)
 * @param {Date} date - Date to check
 * @param {string} city - City name (optional, for city-specific closures)
 * @returns {boolean} True if the date is a court closure
 */
function isCourtClosure(date, city = null) {
  // Check general court closure dates (applies to all cities)
  const isGeneralClosure = courtClosureDates.some(
    (closure) =>
      closure.getDate() === date.getDate() &&
      closure.getMonth() === date.getMonth() &&
      closure.getFullYear() === date.getFullYear()
  );

  if (isGeneralClosure) {
    return true;
  }

  // Check city-specific closures if city is provided
  if (city && citySpecificClosures[city]) {
    return citySpecificClosures[city].some(
      (closure) =>
        closure.getDate() === date.getDate() &&
        closure.getMonth() === date.getMonth() &&
        closure.getFullYear() === date.getFullYear()
    );
  }

  return false;
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
 * Get the next occurrence of a specific weekday
 * @param {Date} fromDate - Starting date
 * @param {number} targetWeekday - Target day (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
 * @returns {Date} Next occurrence of the target weekday
 */
function getNextWeekday(fromDate, targetWeekday) {
  const date = new Date(fromDate);
  const currentDay = date.getDay();
  
  if (currentDay === targetWeekday) {
    return date; // Already on the target day
  }
  
  const daysUntilTarget = ((targetWeekday - currentDay) + 7) % 7;
  date.setDate(date.getDate() + daysUntilTarget);
  
  return date;
}

/**
 * Get the closest weekday from a list of possible days
 * @param {Date} targetDate - Target date
 * @param {number[]} possibleDays - Array of possible weekdays
 * @returns {Date} Date with closest weekday
 */
function getClosestWeekday(targetDate, possibleDays) {
  const targetDay = targetDate.getDay();
  
  // If target day is already in possible days, use it
  if (possibleDays.includes(targetDay)) {
    return new Date(targetDate);
  }
  
  // Find closest possible day
  let minDistance = 7;
  let bestDay = possibleDays[0];
  
  for (const day of possibleDays) {
    const forward = (day - targetDay + 7) % 7;
    const backward = (targetDay - day + 7) % 7;
    const distance = Math.min(forward, backward);
    
    if (distance < minDistance) {
      minDistance = distance;
      bestDay = day;
    }
  }
  
  return getNextWeekday(targetDate, bestDay);
}

/**
 * Get day of week based on surname letter
 * @param {string} initial - First letter of surname
 * @param {Object} dayRules - Rules mapping letter ranges to days
 * @returns {number} Day of week (1=Mon, 2=Tue, etc.)
 */
function getSurnameDay(initial, dayRules) {
  for (const [range, day] of Object.entries(dayRules)) {
    const [start, end] = range.split('-');
    if (initial >= start && initial <= end) {
      return day;
    }
  }
  return 1; // Default to Monday if not found
}

/**
 * Fingerprint date calculation - 1 business day prior to court
 * Prints can happen Monday-Friday at 0900hrs or 1800hrs depending on squad.
 * @param {Date} courtDate - Court date
 * @param {string} issuingSquad - Issuing squad (A, B, C, or D)
 * @returns {Object} Fingerprint date information
 */
function calculateFingerprintDate(courtDate, issuingSquad) {
  // Find 1 business day prior to court date
  // Skip weekends and holidays
  let fingerprintDate = new Date(courtDate);
  let attempts = 0;

  while (attempts < 30) { // Safety limit to prevent infinite loop
    fingerprintDate.setDate(fingerprintDate.getDate() - 1);
    attempts++;

    // Check if it's a valid business day (Monday-Friday, not a holiday)
    const dayOfWeek = fingerprintDate.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday

    if (isWeekday && !isHoliday(fingerprintDate)) {
      break; // Found a valid business day
    }
  }

  // Determine time based on squad
  const isNightSquad = issuingSquad === "B" || issuingSquad === "D";
  const fingerprintTime = isNightSquad ? "1800hrs" : "0900hrs";

  return {
    date: fingerprintDate,
    time: fingerprintTime,
    location: fingerprintInfo.location,
    isHoliday: isHoliday(fingerprintDate),
    daysBefore: Math.floor((courtDate - fingerprintDate) / (24 * 60 * 60 * 1000))
  };
}

/**
 * Legacy function for backward compatibility - returns just the optimal date
 * @param {Date} courtDate - Court date
 * @param {string} issuingSquad - Issuing squad (A, B, C, or D)
 * @returns {Date} Optimal fingerprint date
 */
function findBestFingerprintDate(courtDate, issuingSquad) {
  const result = calculateFingerprintDate(courtDate, issuingSquad);
  return result.date;
}

/**
 * Check if a date is a valid fingerprint day
 * Fingerprints can happen Monday-Friday, excluding holidays.
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is a valid fingerprint day
 */
function isValidFingerprintDay(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5 && !isHoliday(date); // Monday (1) to Friday (5), not a holiday
}

/**
 * Determine which squads are working on a given date (kept for compatibility)
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