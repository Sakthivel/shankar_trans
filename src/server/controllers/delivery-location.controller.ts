import { Request, Response, NextFunction } from "express";
import { deliveryLocationService } from "../services/delivery-location.service";

export class DeliveryLocationController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.active === "true") {
        const data = await deliveryLocationService.findAllActive();
        res.json({ success: true, data });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await deliveryLocationService.findAll(page, limit);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const location = await deliveryLocationService.create(req.body);
      res.status(201).json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const location = await deliveryLocationService.update(id, req.body);
      res.json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await deliveryLocationService.delete(id);
      res.json({ success: true, message: "Delivery location deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const deliveryLocationController = new DeliveryLocationController();
