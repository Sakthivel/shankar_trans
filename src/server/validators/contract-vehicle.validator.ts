import { z } from "zod";

export const contractVehicleSchema = z.object({
  month: z.string().min(1, "Month is required"),
  year: z.string().min(1, "Year is required"),
  vehicleId: z.number().int().positive(),
  serialNo: z.number().int().positive(),
  date: z.string().or(z.date()),
  tripId: z.string().min(1, "Trip ID is required"),
  driverId: z.number().int().positive(),
  workPlace: z.string().min(1, "Work place is required"),
  shift: z.enum(["DAY", "NIGHT"]),
  workingDetails: z.string().min(1, "Working details are required"),
  startKm: z.number(),
  closeKm: z.number(),
  runningKm: z.number(),
  diesel: z.number(),
  mileage: z.number(),
  dieselKm: z.number(),
  dieselDebit: z.number(),
});
