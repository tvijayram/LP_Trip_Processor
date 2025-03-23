import { test, expect, request, APIResponse } from "@playwright/test";
import fs from 'fs';
import Papa from 'papaparse';
import { APIStatus, TripStatus, TripCount } from '../../data/status';
import Charges from '../../data/charges';

test.describe("Littlepay Fare Calculaiton for the trips based on Taps", () => {
  let response: any;
  let parsedCSV: any;
  let completedTrips = 0;
  let cancelledTrips = 0;
  let incompleteTrips = 0;

  // Read the CSV file content containing Taps data
  test.beforeAll(async ({ request }) => {
    const filePath = 'data/taps.csv';
    try {
      const fileBuffer = fs.readFileSync(filePath);
      // Send the POST request with the file
      response = await request.post(`${process.env.BASE_URL}process-tap-file`, {
        multipart: {
          file: {
            name: 'taps.csv',
            mimeType: 'text/csv',
            buffer: fileBuffer
          }
        }
      });
    } catch (error) {
      console.error("Error reading or parsing CSV file:", error);
      throw error;  // Fails the test if parsing fails
    }

    expect(response.status()).toBe(APIStatus.ok); // Ensure API response is 200
    const csvData = await response.text();
    try {
      //Parse the CSV response to JSON response for data validation
      parsedCSV = Papa.parse(csvData, { header: true }).data.filter(row => row.Started);
      //console.log("Trips Response in JSON format...", parsedCSV);
      if (!parsedCSV || parsedCSV.length === 0) {
        throw new Error("CSV data is empty or failed to parse.");
      }
    }
    catch (error) {
      console.error("Error reading or parsing CSV file:", error);
      throw error;  // Fails the test if parsing fails
    }
    //expect(parsedCSV.success).toBeTruthy();
  });

  // test.afterEach(async ({ }, testInfo) => {
  //   if (testInfo.errors.length > 0) {
  //     console.log("Test failed, but continuing execution...");
  //   }
  // });

  // Check for successful API response
  test("process-tap-file API call returns 200 status", async () => {
    await test.step("should return status code 200", () => {
      expect(response.status()).toBe(APIStatus.ok);
    });
  });

  // Check for Data validation in the response
  test("Validate the contents of output - Trip response", async () => {
    // Iterate and validate each trip object
    parsedCSV.forEach((trip, index) => {
      expect.soft(trip).toHaveProperty('Started');
      expect.soft(trip).toHaveProperty('Finished');
      expect.soft(trip).toHaveProperty('DurationSecs');
      expect.soft(trip).toHaveProperty('FromStopId');
      expect.soft(trip).toHaveProperty('ToStopId');
      expect.soft(trip).toHaveProperty('ChargeAmount');
      expect.soft(trip).toHaveProperty('CompanyId');
      expect.soft(trip).toHaveProperty('BusID');
      expect.soft(trip).toHaveProperty('PAN');
      expect.soft(trip).toHaveProperty('Status');

      // Validate non-empty fields (except Finished, which may be empty for INCOMPLETE trips)
      expect.soft(trip.Started).not.toBe('');
      expect.soft(trip.DurationSecs).not.toBe('');
      expect.soft(trip.FromStopId).not.toBe('');
      expect.soft(trip.ChargeAmount).not.toBe('');
      expect.soft(trip.CompanyId).not.toBe('');
      expect.soft(trip.BusID).not.toBe('');
      expect.soft(trip.PAN).not.toBe('');
      expect.soft(Object.values(TripStatus)).toContain(trip.Status);

      // Count trips based on status
      if (trip.Status === 'COMPLETED') {
        completedTrips++;
      } else if (trip.Status === 'INCOMPLETE') {
        incompleteTrips++;
      } else if (trip.Status === 'CANCELLED') {
        cancelledTrips++;
      }
      console.log(`Trip ${index + 1} validation passed ✅`);
    });
    console.log('Trips count...', completedTrips, cancelledTrips, incompleteTrips);
  });

  // Check for Total number of trips, assuming we are ignoring cancelledTrips
  test("check for total trip count", async () => {
    let tripCount = completedTrips + incompleteTrips - cancelledTrips;
    console.log('trip count...', tripCount);
    expect.soft(tripCount).toBe(4);  //based on the input data
  });

  // Check for Completed trips
  test("Validate number of COMPLETED trips", async () => {
    await test.step("Check the number of completed trips", async () => {
      console.log("completedTrips....*******************", completedTrips)
      expect.soft(completedTrips).toBe(TripCount.COMPLETED);
    });
  });

  // Check for Cancelled trips
  test("Validate number of CANCELLED trips", async () => {
    expect.soft(cancelledTrips).toBe(TripCount.CANCELLED);
  });

  // Check for Incomplete trips
  test("Validate number of INCOMPLETE trips", async () => {
    expect.soft(incompleteTrips).toBe(TripCount.INCOMPLETE);
  });

  // Check the Charge Amount per PAN
  test("Validate charge per PAN", async () => {
    // Extract unique PANs from parsed data
    const uniquePANs = [...new Set(parsedCSV.map((trip: any) => trip.PAN))];
    await test.step("Verify charges match expected values", async () => {
      uniquePANs.forEach((pan) => {
        test.step(`Validate charge for PAN: ${pan}`, async () => {
          const tripsForPAN = parsedCSV.filter((trip: any) => trip.PAN === pan);
          tripsForPAN.forEach((trip, index) => {
            const expectedCharge = Charges[trip.PAN] || 0;
            console.log(`Checking charge for PAN: ${trip.PAN} -> Expected: $${expectedCharge}, Actual: $${trip.ChargeAmount}`);
            expect.soft(Number(trip.ChargeAmount)).toBe(expectedCharge);
          });
        });
      });
    });
  });

});
