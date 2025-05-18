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
 * Find the best fingerprint date based on squad
 * @param {Date} courtDate - Court date
 * @param {string} issuingSquad - Issuing squad (A, B, C, or D)
 * @returns {Date} Fingerprint date
 */
function findBestFingerprintDate(courtDate, issuingSquad) {
  const isNightSquad = issuingSquad === "B" || issuingSquad === "D";

  const potentialDates = [];

  for (let i = 2; i <= 3; i++) {
    const testDate = new Date(courtDate);
    testDate.setDate(courtDate.getDate() - i);

    if (testDate.getDay() === 0 || testDate.getDay() === 6) {
      continue;
    }

    if (isHoliday(testDate)) {
      continue;
    }

    const dayOfWeek = testDate.getDay();
    if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) {
      continue;
    }

    const workingSquads = getWorkingSquads(testDate);

    let squadMatch = false;
    if (isNightSquad && workingSquads.night === issuingSquad) {
      squadMatch = true;
    } else if (!isNightSquad && workingSquads.day === issuingSquad) {
      squadMatch = true;
    }

    potentialDates.push({
      date: new Date(testDate),
      squadMatch: squadMatch,
      day: testDate.getDay(),
    });
  }

  const squadMatches = potentialDates.filter((d) => d.squadMatch);
  if (squadMatches.length > 0) {
    return squadMatches[0].date;
  }

  if (potentialDates.length > 0) {
    const twoDaysBefore = potentialDates.find((d) => {
      const dayDiff = Math.round(
        (courtDate - d.date) / (24 * 60 * 60 * 1000)
      );
      return dayDiff === 2;
    });

    if (twoDaysBefore) {
      return twoDaysBefore.date;
    }
    return potentialDates[0].date;
  }

  let defaultDate = new Date(courtDate);
  defaultDate.setDate(courtDate.getDate() - 2);

  const dayOfWeek = defaultDate.getDay();
  if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) {
    if (dayOfWeek === 1) {
      defaultDate.setDate(defaultDate.getDate() - 4);
    } else if (dayOfWeek === 5) {
      defaultDate.setDate(defaultDate.getDate() - 1);
    } else if (dayOfWeek === 6) {
      defaultDate.setDate(defaultDate.getDate() - 2);
    } else if (dayOfWeek === 0) {
      defaultDate.setDate(defaultDate.getDate() - 3);
    }
  }

  if (isHoliday(defaultDate)) {
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
  return day >= 2 && day <= 4;
}