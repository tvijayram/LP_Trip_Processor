
`Overview`
This project uses Playwright for end-to-end testing, specifically to validate trip charge amounts based on parsed JSON data. 
The tests verify if the charge amounts match expected values for each passenger based on their Primary Account Number (PAN).

`Prerequisites`

Before running the tests, ensure you have the following installed:

Node.js (v16 or later)
Playwright

`Installation`

Clone this repository:

git clone https://github.com/tvijayram/LP_Trip_Processor.git
cd LP_Trip_Processor

`Install dependencies:`

npm install

``Test Structure``

The test script is located in  tests/trips/cal.trips.from.taps.spec.ts
The expected charge amounts are defined in a mapping object.
Each test case validates the charge for a specific PAN.

`Running Tests`

To execute the Playwright tests, use:
npm run test:sandbox [Assuming the tests are being run in sandbox env]

`To run a specific test file:`

npx playwright test tests/trips/cal.trips.from.taps.spec.ts

Example Output

✓ Validate charge for PAN: 5500005555555559 (500ms)

✓ Validate charge for PAN: 5500006666666666 (480ms)

Trip for PAN: 5500005555555559
Expected Charge: $3.25
Actual Charge: $3.25

Trip for PAN: 5500006666666666
Expected Charge: $5.50
Actual Charge: $5.50

`Debugging Tests`

Run tests with verbose logs:
npx playwright test --debug

`Folder Structure`

/project-root
│── tests/
│   ├──   cal.trips.from.taps.spec.ts # Test script
│── package.json  # Project dependencies
│── playwright.config.ts  # Playwright configuration
│── README.md  # This file

`Additional Configuration`
Modify playwright.config.ts to change settings such as timeouts, browsers, or reports.

`License`
This project is licensed under the MIT License.