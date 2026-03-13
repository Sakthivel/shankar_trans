import { Request, Response, NextFunction } from "express";
import { driverService } from "../services/driver.service";

export class DriverController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.active === "true") {
        const data = await driverService.findAllActive();
        res.json({ success: true, data });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await driverService.findAll(page, limit);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const driver = await driverService.create(req.body);
      res.status(201).json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const driver = await driverService.update(id, req.body);
      res.json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await driverService.delete(id);
      res.json({ success: true, message: "Driver deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const driverController = new DriverController();
