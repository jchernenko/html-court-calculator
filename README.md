Court & Fingerprint Date Calculator
This application helps calculate court and fingerprint dates based on various parameters such as court city, last name, case type, and issuing squad.
File Structure
The application is organized into the following files:
court-calculator/
├── index.html # Main HTML file with structure
├── css/
│ └── styles.css # CSS styles
├── js/
│ ├── main.js # Core functionality
│ ├── dates.js # Date calculation functions
│ ├── data.js # Static data (holidays, court dates)
│ ├── ui.js # UI functions
│ └── tests.js # Test suite functionality
└── README.md # This file
Installation

Create the folder structure as shown above
Copy each file into its respective location
Once all files are in place, open index.html in a web browser

Network Deployment
For shared network deployment:

Create a folder on your shared network drive (e.g., \\SHARED\Court-Calculator\)
Copy the entire folder structure to this network location
Create a shortcut to the index.html file and distribute to users
Users can access the calculator by opening the shortcut

Updating
If you need to update the calculator in the future:

Make changes to the appropriate files
Test thoroughly
Update the "Last Update" date in the footer in index.html
Replace the files on the network share

Features

Calculates court dates based on city, case type, and last name initial
Determines fingerprint dates based on court date and squad rotation
Shows squad match information for fingerprint dates
Provides copy/paste text for court and fingerprint information
Includes a comprehensive test suite

Maintenance

Court dates for Richmond are defined in data.js and may need updates annually
Canadian holidays are defined in data.js and should be verified each year
Court information (times, addresses) can be modified in data.js if needed

Troubleshooting
If you encounter issues:

Check that all files are present and in the correct locations
Verify that the browser has JavaScript enabled
Run the Enhanced Tests to check for calculation issues
Check the browser's developer console for any JavaScript errors

Support
For support or to report issues, please contact the IT department.
Last Updated: May 17, 2025
