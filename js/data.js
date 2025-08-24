/**
 * data.js - Contains static data for the Court & Fingerprint Date Calculator
 * This file defines holidays, court dates, and other static information.
 * Updated Richmond court dates per 2025 Crown First Appearances Calendar.
 */

// Canadian holidays for 2025
const holidays = [
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

// RICHMOND COURT DATES 2025 - Updated from new Crown First Appearances Calendar
const richmondCourtDates = {
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
    new Date(2025, 4, 6),   // May 6
    new Date(2025, 4, 20),  // May 20
    new Date(2025, 5, 3),   // June 3
    new Date(2025, 5, 17),  // June 17
    new Date(2025, 6, 1),   // July 1
    new Date(2025, 6, 15),  // July 15
    new Date(2025, 6, 29),  // July 29
    new Date(2025, 7, 5),   // August 5
    new Date(2025, 7, 19),  // August 19
    new Date(2025, 8, 2),   // September 2
    new Date(2025, 8, 16),  // September 16
    new Date(2025, 8, 30),  // September 30
    new Date(2025, 9, 7),   // October 7
    new Date(2025, 9, 21),  // October 21
    new Date(2025, 10, 4),  // November 4
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
    new Date(2025, 4, 13),  // May 13
    new Date(2025, 4, 27),  // May 27
    new Date(2025, 5, 10),  // June 10
    new Date(2025, 5, 24),  // June 24
    new Date(2025, 6, 8),   // July 8
    new Date(2025, 6, 22),  // July 22
    new Date(2025, 7, 12),  // August 12
    new Date(2025, 7, 26),  // August 26
    new Date(2025, 8, 9),   // September 9
    new Date(2025, 8, 23),  // September 23
    new Date(2025, 9, 14),  // October 14
    new Date(2025, 9, 28),  // October 28
    new Date(2025, 10, 11), // November 11
    new Date(2025, 10, 25), // November 25
    new Date(2025, 11, 9),  // December 9
    new Date(2025, 11, 23), // December 23
  ],
};

// Court information by city and case type (kept for reference but now defined in main.js)
const courtInfo = {
  richmond: {
    adult: {
      time: "0900hrs",
      address: "Richmond Provincial Court: Court Room 104 - 7577 Elmbridge Way, Richmond, BC V6X 4J2",
      note: "This date is for last names"
    },
    youth: {
      time: "0900hrs",
      address: "Richmond Provincial Court: Court Room 104 - 7577 Elmbridge Way, Richmond, BC V6X 4J2",
      note: "This date is for last names"
    }
  },
  surrey: {
    adult: {
      time: "1400hrs",
      address: "Surrey Provincial Court: Court Room 100 - 14340 57th Ave, Surrey, BC V3X 1B2",
      note: "This court covers Surrey, Delta, Langley & White Rock."
    },
    youth: {
      time: "1400hrs",
      address: "Surrey Provincial Court: Court Room 312 - 14340 57th Ave, Surrey, BC V3X 1B2",
      note: "This court covers Surrey, Delta, Langley & White Rock."
    }
  },
  "new-westminster": {
    adult: {
      time: "1000hrs",
      address: "New Westminster Law Courts: Court Room 213 - 651 Carnarvon Street, New Westminster, BC V3M 1C9",
      note: "Client needs to check docket for court room number."
    },
    youth: {
      time: "1000hrs",
      address: "New Westminster Law Courts: Court Room 213 - 651 Carnarvon Street, New Westminster, BC V3M 1C9",
      note: "Client needs to check docket for court room number."
    }
  },
  vancouver: {
    adult: {
      time: "1400hrs",
      address: "Vancouver Provincial Court: Court Room 307 - 222 Main Street, Vancouver, BC V6A 2S8",
      note: "This court covers Vancouver and Burnaby."
    },
    youth: {
      time: "0930hrs",
      address: "Vancouver Provincial Court: Court Room 101 - 800 Hornby Street, Vancouver, BC V6Z 2C5",
      note: "This court covers Vancouver and Burnaby."
    }
  },
  burnaby: {
    adult: {
      time: "1400hrs",
      address: "Vancouver Provincial Court: Court Room 307 - 222 Main Street, Vancouver, BC V6A 2S8",
      note: "This court covers Vancouver and Burnaby."
    },
    youth: {
      time: "0930hrs",
      address: "Vancouver Provincial Court: Court Room 101 - 800 Hornby Street, Vancouver, BC V6Z 2C5",
      note: "This court covers Vancouver and Burnaby."
    }
  },
  coquitlam: {
    adult: {
      time: "0900hrs",
      address: "Port Coquitlam Provincial Court: Court Room 3 - 2620 Mary Hill Rd, Port Coquitlam, BC V3C 3B2",
      note: "This court covers Coquitlam, Port Coquitlam, Port Moody, Pitt Meadows & Maple Ridge."
    },
    youth: {
      time: "0900hrs",
      address: "Port Coquitlam Provincial Court: Court Room 3 - 2620 Mary Hill Rd, Port Coquitlam, BC V3C 3B2",
      note: "This court covers Coquitlam, Port Coquitlam, Port Moody, Pitt Meadows & Maple Ridge."
    }
  },
  "north-vancouver": {
    adult: {
      time: "0900hrs",
      address: "North Vancouver Provincial Court: Court Room 3 - 200 E 23rd Street, North Vancouver, BC V7L 4R4",
      note: "This court covers North Vancouver, West Vancouver, Squamish & Whistler."
    },
    youth: {
      time: "0900hrs",
      address: "North Vancouver Provincial Court: Court Room 3 - 200 E 23rd Street, North Vancouver, BC V7L 4R4",
      note: "This court covers North Vancouver, West Vancouver, Squamish & Whistler."
    }
  }
};

const fingerprintInfo = {
  location: "MVTP HQ: 300-287 Nelson's Court, New Westminster, BC V3L 0E7"
};