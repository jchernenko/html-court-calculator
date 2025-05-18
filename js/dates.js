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
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
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
  // Create a reference date - we know A/B were working on April 28, 2025
  const referenceDate = new Date(2025, 3, 28); // April 28, 2025

  // Calculate the number of days between reference date and given date
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const dayDifference = Math.round((date - referenceDate) / oneDay);
  
  // Ensure the result is positive by using modulo for negative differences
  // This handles dates before the reference date correctly
  const adjustedDifference = ((dayDifference % 8) + 8) % 8;

  // Determine the squad rotation cycle (8 days total in rotation)
  if (adjustedDifference < 4) {
    return {
      day: "A", // A Squad works days
      night: "B", // B Squad works nights
    };
  } else {
    return {
      day: "C", // C Squad works days
      night: "D", // D Squad works nights
    };
  }
}

/**
 * Find the best fingerprint date based on squad
 * @param {Date} courtDate - Court date
 * @param {string} issuingSquad - Issuing squad (A, B, C, or D)
 * @returns {Date} Fingerprint date
 */
function findBestFingerprintDate(courtDate, issuingSquad) {
  const isNightSquad = issuingSquad === "B" || issuingSquad === "D";

  // Only check 2-3 days before court date (reasonable window)
  const potentialDates = [];

  // Check only 2 and 3 days before court date
  for (let i = 2; i <= 3; i++) {
    const testDate = new Date(courtDate);
    testDate.setDate(courtDate.getDate() - i);

    // Skip weekends
    if (testDate.getDay() === 0 || testDate.getDay() === 6) {
      continue;
    }

    // Skip holidays
    if (isHoliday(testDate)) {
      continue;
    }

    // Skip Mondays and Fridays - ONLY allow Tuesdays (2), Wednesdays (3), Thursdays (4)
    const dayOfWeek = testDate.getDay();
    if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) {
      continue;
    }

    const workingSquads = getWorkingSquads(testDate);

    // Check if the issuing squad is working on this date
    let squadMatch = false;
    if (isNightSquad && workingSquads.night === issuingSquad) {
      squadMatch = true;
    } else if (!isNightSquad && workingSquads.day === issuingSquad) {
      squadMatch = true;
    }

    // Add the date to potential dates, marking if it's a squad match
    potentialDates.push({
      date: new Date(testDate),
      squadMatch: squadMatch,
      day: testDate.getDay(),
    });
  }

  // First prioritize squad match within the 2-3 day window
  const squadMatches = potentialDates.filter((d) => d.squadMatch);
  if (squadMatches.length > 0) {
    // If multiple squad matches, prefer dates closer to court date
    return squadMatches[0].date;
  }

  // If no squad matches, default to 2 days before court if it's a Tue/Wed/Thu
  // But ensure we're not picking a weekend or holiday
  if (potentialDates.length > 0) {
    // Try to find a date 2 days before first (closest to court date)
    const twoDaysBefore = potentialDates.find((d) => {
      const dayDiff = Math.round(
        (courtDate - d.date) / (24 * 60 * 60 * 1000)
      );
      return dayDiff === 2;
    });

    if (twoDaysBefore) {
      return twoDaysBefore.date;
    }

    // Otherwise use any available date in the window
    return potentialDates[0].date;
  }

  // Fallback logic for when no valid dates in the 2-3 day window
  // Find the closest Tuesday, Wednesday or Thursday before the court date
  let defaultDate = new Date(courtDate);
  defaultDate.setDate(courtDate.getDate() - 2); // Start with 2 days before

  // If defaultDate is not a Tue/Wed/Thu, find the closest one
  const dayOfWeek = defaultDate.getDay();
  if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) {
    // Adjust to the nearest previous Tuesday, Wednesday, or Thursday
    if (dayOfWeek === 1) {
      // Monday -> previous Thursday
      defaultDate.setDate(defaultDate.getDate() - 4);
    } else if (dayOfWeek === 5) {
      // Friday -> previous Thursday
      defaultDate.setDate(defaultDate.getDate() - 1);
    } else if (dayOfWeek === 6) {
      // Saturday -> previous Thursday
      defaultDate.setDate(defaultDate.getDate() - 2);
    } else if (dayOfWeek === 0) {
      // Sunday -> previous Thursday
      defaultDate.setDate(defaultDate.getDate() - 3);
    }
  }

  // Check if defaultDate is a holiday
  if (isHoliday(defaultDate)) {
    // Try previous day if it's a valid fingerprint day
    const prevDay = new Date(defaultDate);
    prevDay.setDate(defaultDate.getDate() - 1);

    if (
      (prevDay.getDay() === 2 ||
        prevDay.getDay() === 3 ||
        prevDay.getDay() === 4) &&
      !isHoliday(prevDay)
    ) {
      return prevDay;
    }

    // If previous day is not valid, try two days before
    const prevTwoDays = new Date(defaultDate);
    prevTwoDays.setDate(defaultDate.getDate() - 2);

    if (
      (prevTwoDays.getDay() === 2 ||
        prevTwoDays.getDay() === 3 ||
        prevTwoDays.getDay() === 4) &&
      !isHoliday(prevTwoDays)
    ) {
      return prevTwoDays;
    }
  }

  return defaultDate;
}

/**
 * Check if a date is a valid fingerprint day
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is a valid fingerprint day
 */
function isValidFingerprintDay(date) {
  const day = date.getDay();
  return day >= 2 && day <= 4; // Tuesday(2), Wednesday(3), Thursday(4)
}