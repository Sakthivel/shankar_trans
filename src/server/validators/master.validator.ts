import { z } from "zod";

export const driverSchema = z.object({
  driverName: z.string().min(1, "Driver name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const loadingPlantSchema = z.object({
  loadingPlant: z.string().min(1, "Loading plant name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const deliveryLocationSchema = z.object({
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
