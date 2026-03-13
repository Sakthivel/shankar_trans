import { Request, Response, NextFunction } from "express";
import { loadingPlantService } from "../services/loading-plant.service";

export class LoadingPlantController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.active === "true") {
        const data = await loadingPlantService.findAllActive();
        res.json({ success: true, data });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await loadingPlantService.findAll(page, limit);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const plant = await loadingPlantService.create(req.body);
      res.status(201).json({ success: true, data: plant });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const plant = await loadingPlantService.update(id, req.body);
      res.json({ success: true, data: plant });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await loadingPlantService.delete(id);
      res.json({ success: true, message: "Loading plant deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const loadingPlantController = new LoadingPlantController();
