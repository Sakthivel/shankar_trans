import { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service";

export class ReportController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as "lpg-tanker" | "contract-vehicle" | "road-trip";
      if (!type || !["lpg-tanker", "contract-vehicle", "road-trip"].includes(type)) {
        res.status(400).json({ success: false, error: "Invalid report type" });
        return;
      }

      const filters = {
        type,
        vehicleId: req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined,
        driverId: req.query.driverId ? parseInt(req.query.driverId as string) : undefined,
        tripId: req.query.tripId as string | undefined,
        month: req.query.month as string | undefined,
        year: req.query.year as string | undefined,
      };

      const data = await reportService.generateReport(filters);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();
