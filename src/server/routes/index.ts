import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import driverRoutes from "./driver.routes";
import vehicleRoutes from "./vehicle.routes";
import loadingPlantRoutes from "./loading-plant.routes";
import deliveryLocationRoutes from "./delivery-location.routes";
import lpgTankerRoutes from "./lpg-tanker.routes";
import contractVehicleRoutes from "./contract-vehicle.routes";
import roadTripRoutes from "./road-trip.routes";
import reportRoutes from "./report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/drivers", driverRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/loading-plants", loadingPlantRoutes);
router.use("/delivery-locations", deliveryLocationRoutes);
router.use("/lpg-tankers", lpgTankerRoutes);
router.use("/contract-vehicles", contractVehicleRoutes);
router.use("/road-trips", roadTripRoutes);
router.use("/reports", reportRoutes);

export default router;
