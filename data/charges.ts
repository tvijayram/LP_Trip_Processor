// Expected charge amounts based on PAN numbers
// Assumption: ChargeAmount is not in consistent format. Leading Zero’s are being omitted from the ChargeAmount after decimal point.

const EXPECTED_CHARGES: Record<string, number> = {
  "5500005555555559": 3.25,
  "4444333322221111": 5.5,
  "5555555555554444": 7.3,
  "4917610000000000": 0.0
};

export default EXPECTED_CHARGES;