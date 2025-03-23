export const APIStatus = {
  ok: 200,
  notFound: 404,
  badRequest: 400,
  unauthorized: 401,
};

export enum TripStatus {
  COMPLETED = "COMPLETED",
  INCOMPLETE = "INCOMPLETE",
  CANCELLED = "CANCELLED"
}

export enum TripCount {
  COMPLETED = 2,
  INCOMPLETE = 1,
  CANCELLED = 1
}

