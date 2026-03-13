import { Request, Response, NextFunction } from "express";
import { vehicleService } from "../services/vehicle.service";

export class VehicleController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.active === "true") {
        const data = await vehicleService.findAllActive();
        res.json({ success: true, data });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await vehicleService.findAll(page, limit);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.create(req.body);
      res.status(201).json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const vehicle = await vehicleService.update(id, req.body);
      res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await vehicleService.delete(id);
      res.json({ success: true, message: "Vehicle deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const vehicleController = new VehicleController();
