/**
 * data.js - Contains static data for the Court & Fingerprint Date Calculator
 * This file defines holidays, court dates, and court information.
 */

// Canadian holidays for 2025
const holidays2025 = [
  new Date(2025, 0, 1), // New Year's Day
  new Date(2025, 1, 17), // Family Day (BC)
  new Date(2025, 3, 18), // Good Friday
  new Date(2025, 3, 21), // Easter Monday
  new Date(2025, 4, 19), // Victoria Day
  new Date(2025, 6, 1), // Canada Day
  new Date(2025, 7, 4), // BC Day
  new Date(2025, 8, 1), // Labour Day
  new Date(2025, 8, 30), // National Day for Truth and Reconciliation
  new Date(2025, 9, 13), // Thanksgiving
  new Date(2025, 10, 11), // Remembrance Day
  new Date(2025, 11, 25), // Christmas Day
  new Date(2025, 11, 26), // Boxing Day
];

// Canadian holidays for 2026
const holidays2026 = [
  new Date(2026, 0, 1),   // New Year's Day - Thursday, January 1
  new Date(2026, 1, 16),  // Family Day (BC) - Third Monday of February
  new Date(2026, 3, 3),   // Good Friday - April 3
  new Date(2026, 3, 6),   // Easter Monday - April 6
  new Date(2026, 4, 18),  // Victoria Day - Monday before May 25
  new Date(2026, 6, 1),   // Canada Day - Wednesday, July 1
  new Date(2026, 7, 3),   // BC Day - First Monday of August
  new Date(2026, 8, 7),   // Labour Day - First Monday of September
  new Date(2026, 8, 30),  // National Day for Truth and Reconciliation - September 30
  new Date(2026, 9, 12),  // Thanksgiving - Second Monday of October
  new Date(2026, 10, 11), // Remembrance Day - Wednesday, November 11
  new Date(2026, 11, 25), // Christmas Day - Friday, December 25
  new Date(2026, 11, 28), // Boxing Day (observed) - Monday, December 28
];

// Combined holidays array for both years
const holidays = [...holidays2025, ...holidays2026];

// Special court closure dates for all cities
const courtClosureDates = [
  new Date(2025, 11, 3),  // December 3, 2025
  new Date(2025, 11, 4),  // December 4, 2025
  new Date(2025, 11, 5),  // December 5, 2025
];

// City-specific court closure dates
const citySpecificClosures = {
  vancouver: [
    new Date(2025, 11, 29), // December 29, 2025
    new Date(2025, 11, 30), // December 30, 2025
    new Date(2025, 11, 31), // December 31, 2025
    new Date(2026, 0, 1),   // January 1, 2026
    new Date(2026, 0, 2),   // January 2, 2026
  ],
  burnaby: [
    new Date(2025, 11, 29), // December 29, 2025
    new Date(2025, 11, 30), // December 30, 2025
    new Date(2025, 11, 31), // December 31, 2025
    new Date(2026, 0, 1),   // January 1, 2026
    new Date(2026, 0, 2),   // January 2, 2026
  ]
};

// RICHMOND COURT DATES 2025 - Updated from Crown First Appearances Calendar
const richmondCourtDates2025 = {
  "A-K": [ // Purple Tuesday dates
    new Date(2025, 0, 7),   // January 7
    new Date(2025, 0, 21),  // January 21
    new Date(2025, 1, 4),   // February 4
    new Date(2025, 1, 18),  // February 18
    new Date(2025, 2, 4),   // March 4
    new Date(2025, 2, 18),  // March 18
    new Date(2025, 3, 1),   // April 1
    new Date(2025, 3, 15),  // April 15
    new Date(2025, 3, 29),  // April 29
    new Date(2025, 4, 13),   // May 13
    new Date(2025, 4, 27),  // May 27
    new Date(2025, 5, 10),   // June 10
    new Date(2025, 5, 24),  // June 24
    new Date(2025, 6, 15),  // July 15
    new Date(2025, 6, 29),  // July 29
    new Date(2025, 7, 12),   // August 12
    new Date(2025, 7, 26),  // August 26
    new Date(2025, 8, 9),   // September 9
    new Date(2025, 8, 23),  // September 23
    new Date(2025, 9, 14),   // October 14
    new Date(2025, 9, 28),  // October 28
    new Date(2025, 10, 18), // November 18
    new Date(2025, 11, 2),  // December 2
    new Date(2025, 11, 16), // December 16
    new Date(2025, 11, 30), // December 30
  ],
  "L-Z": [ // Green Tuesday dates
    new Date(2025, 0, 14),  // January 14
    new Date(2025, 0, 28),  // January 28
    new Date(2025, 1, 11),  // February 11
    new Date(2025, 1, 25),  // February 25
    new Date(2025, 2, 11),  // March 11
    new Date(2025, 2, 25),  // March 25
    new Date(2025, 3, 8),   // April 8
    new Date(2025, 3, 22),  // April 22
    new Date(2025, 4, 6),  // May 6
    new Date(2025, 4, 20),  // May 20
    new Date(2025, 5, 3),  // June 3
    new Date(2025, 5, 17),  // June 17
    new Date(2025, 6, 8),   // July 8
    new Date(2025, 6, 22),  // July 22
    new Date(2025, 7, 5),  // August 5
    new Date(2025, 7, 19),  // August 19
    new Date(2025, 8, 2),   // September 2
    new Date(2025, 8, 16),  // September 16
    new Date(2025, 9, 7),  // October 7
    new Date(2025, 9, 21),  // October 21
    new Date(2025, 10, 4), // November 4
    new Date(2025, 10, 25), // November 25
    new Date(2025, 11, 9),  // December 9
    new Date(2025, 11, 23), // December 23
  ],
};

// RICHMOND COURT DATES 2026 - Updated from Crown First Appearances Calendar
const richmondCourtDates2026 = {
  "A-K": [ // Purple Tuesday dates
    new Date(2026, 0, 13),  // January 13
    new Date(2026, 0, 27),  // January 27
    new Date(2026, 1, 10),  // February 10
    new Date(2026, 1, 24),  // February 24
    new Date(2026, 2, 10),  // March 10
    new Date(2026, 2, 24),  // March 24
    new Date(2026, 3, 7),   // April 7
    new Date(2026, 3, 21),  // April 21
    new Date(2026, 4, 5),   // May 5
    new Date(2026, 4, 19),  // May 19
    new Date(2026, 5, 2),   // June 2
    new Date(2026, 5, 16),  // June 16
    new Date(2026, 5, 30),  // June 30
    new Date(2026, 6, 14),  // July 14
    new Date(2026, 6, 28),  // July 28
    new Date(2026, 7, 11),  // August 11
    new Date(2026, 7, 25),  // August 25
    new Date(2026, 8, 8),   // September 8
    new Date(2026, 8, 22),  // September 22
    new Date(2026, 9, 6),   // October 6
    new Date(2026, 9, 20),  // October 20
    new Date(2026, 10, 3),  // November 3
    new Date(2026, 10, 17), // November 17
    new Date(2026, 11, 1),  // December 1
    new Date(2026, 11, 15), // December 15
    new Date(2026, 11, 29), // December 29
  ],
  "L-Z": [ // Green Tuesday dates
    new Date(2026, 0, 6),   // January 6
    new Date(2026, 0, 20),  // January 20
    new Date(2026, 1, 3),   // February 3
    new Date(2026, 1, 17),  // February 17
    new Date(2026, 2, 3),   // March 3
    new Date(2026, 2, 17),  // March 17
    new Date(2026, 2, 31),  // March 31
    new Date(2026, 3, 14),  // April 14
    new Date(2026, 3, 28),  // April 28
    new Date(2026, 4, 12),  // May 12
    new Date(2026, 4, 26),  // May 26
    new Date(2026, 5, 9),   // June 9
    new Date(2026, 5, 23),  // June 23
    new Date(2026, 6, 7),   // July 7
    new Date(2026, 6, 21),  // July 21
    new Date(2026, 7, 4),   // August 4
    new Date(2026, 7, 18),  // August 18
    new Date(2026, 8, 1),   // September 1
    new Date(2026, 8, 15),  // September 15
    new Date(2026, 8, 29),  // September 29
    new Date(2026, 9, 13),  // October 13
    new Date(2026, 9, 27),  // October 27
    new Date(2026, 10, 10), // November 10
    new Date(2026, 10, 24), // November 24
    new Date(2026, 11, 8),  // December 8
    new Date(2026, 11, 22), // December 22
  ],
};

// Combined Richmond court dates for both years
const richmondCourtDates = {
  "A-K": [...richmondCourtDates2025["A-K"], ...richmondCourtDates2026["A-K"]],
  "L-Z": [...richmondCourtDates2025["L-Z"], ...richmondCourtDates2026["L-Z"]],
};


const courtInfo = {
  richmond: {
    adult: {
      time: "0900hrs",
      address: "Richmond Provincial Court: Courtroom 104 - 7577 Elmbridge Way, Richmond, BC V6X 4J2",
      dayType: "calendar",
    },
    youth: {
      time: "0900hrs",
      address: "Richmond Provincial Court: Courtroom 104 - 7577 Elmbridge Way, Richmond, BC V6X 4J2",
      dayType: "calendar",
    }
  },
  vancouver: {
    adult: {
      time: "1400hrs",
      address: "Vancouver Provincial Court: Courtroom 307 - 222 Main Street, Vancouver, BC V6A 2S8",
      dayType: "surname",
      dayRules: {
        "A-F": 1, // Monday
        "G-L": 2, // Tuesday
        "M-R": 3, // Wednesday
        "S-Z": 4  // Thursday
      },
      note: "This court covers Vancouver and Burnaby."
    },
    youth: {
      time: "0930hrs",
      address: "Vancouver Provincial Court: Courtroom 101 - 800 Hornby Street, Vancouver, BC V6Z 2C5",
      dayType: "fixed",
      fixedDay: 4, // Thursday
      note: "This court covers Vancouver and Burnaby."
    }
  },
  burnaby: {
    adult: {
      time: "1400hrs",
      address: "Vancouver Provincial Court: Courtroom 307 - 222 Main Street, Vancouver, BC V6A 2S8",
      dayType: "surname",
      dayRules: {
        "A-F": 1, // Monday
        "G-L": 2, // Tuesday
        "M-R": 3, // Wednesday
        "S-Z": 4  // Thursday
      },
      note: "This court covers Vancouver and Burnaby."
    },
    youth: {
      time: "0930hrs",
      address: "Vancouver Provincial Court: Courtroom 101 - 800 Hornby Street, Vancouver, BC V6Z 2C5",
      dayType: "fixed",
      fixedDay: 4, // Thursday
      note: "This court covers Vancouver and Burnaby."
    }
  },
  surrey: {
    adult: {
      time: "1400hrs",
      address: "Surrey Provincial Court: Courtroom 100 - 14340 57th Ave, Surrey, BC V3X 1B2",
      dayType: "flexible",
      possibleDays: [1, 2, 3, 4, 5],
      note: "This court covers Surrey, Delta, Langley & White Rock."
    },
    youth: {
      time: "0930hrs",
      address: "Surrey Provincial Court: Courtroom 312 - 14340 57th Ave, Surrey, BC V3X 1B2",
      dayType: "fixed",
      fixedDay: 3, // Wednesday
      note: "This court covers Surrey, Delta, Langley & White Rock."
    }
  },
  "new-westminster": {
    adult: {
      time: "1000hrs",
      address: "New Westminster Law Courts: Courtroom 213 - 651 Carnarvon Street, New Westminster, BC V3M 1C9",
      dayType: "fixed",
      fixedDay: 3, // Wednesday
    },
    youth: {
      time: "1000hrs",
      address: "New Westminster Law Courts: Courtroom 213 - 651 Carnarvon Street, New Westminster, BC V3M 1C9",
      dayType: "fixed",
      fixedDay: 3, // Wednesday
    }
  },
  coquitlam: {
    adult: {
      time: "0900hrs",
      address: "Port Coquitlam Provincial Court: Courtroom 3 - 2620 Mary Hill Rd, Port Coquitlam, BC V3C 3B2",
      dayType: "flexible", 
      possibleDays: [1, 3, 4], // Monday, Wednesday, Thursday
      note: "This court covers Coquitlam, Port Coquitlam, Port Moody, Pitt Meadows & Maple Ridge."
    },
    youth: {
      time: "0900hrs",
      address: "Port Coquitlam Provincial Court: Courtroom 3 - 2620 Mary Hill Rd, Port Coquitlam, BC V3C 3B2",
      dayType: "flexible",
      possibleDays: [1, 3, 4], // Monday, Wednesday, Thursday
      note: "This court covers Coquitlam, Port Coquitlam, Port Moody, Pitt Meadows & Maple Ridge."
    }
  },
  "north-vancouver": {
    adult: {
      time: "0900hrs",
      address: "North Vancouver Provincial Court: Courtroom 3 - 200 E 23rd Street, North Vancouver, BC V7L 4R4",
      dayType: "fixed",
      fixedDay: 3, // Wednesday
      note: "This court covers North Vancouver, West Vancouver, Squamish & Whistler."
    },
    youth: {
      time: "0900hrs",
      address: "North Vancouver Provincial Court: Courtroom 3 - 200 E 23rd Street, North Vancouver, BC V7L 4R4",
      dayType: "fixed",
      fixedDay: 3, // Wednesday
      note: "This court covers North Vancouver, West Vancouver, Squamish & Whistler."
    }
  }
};

const fingerprintInfo = {
  location: "MVTP HQ: 300-287 Nelson's Court, New Westminster, BC V3L 0E7"
};