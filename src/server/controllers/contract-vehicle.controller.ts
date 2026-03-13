import { Request, Response, NextFunction } from "express";
import { contractVehicleService } from "../services/contract-vehicle.service";

export class ContractVehicleController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        month: req.query.month as string | undefined,
        year: req.query.year as string | undefined,
        vehicleId: req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined,
        driverId: req.query.driverId ? parseInt(req.query.driverId as string) : undefined,
      };
      const result = await contractVehicleService.findAll(page, limit, filters);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const record = await contractVehicleService.findById(id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const record = await contractVehicleService.create({
        month: body.month,
        year: body.year,
        serialNo: body.serialNo,
        date: new Date(body.date),
        tripId: body.tripId,
        workPlace: body.workPlace,
        shift: body.shift,
        workingDetails: body.workingDetails,
        startKm: body.startKm,
        closeKm: body.closeKm,
        runningKm: body.runningKm,
        diesel: body.diesel,
        mileage: body.mileage,
        dieselKm: body.dieselKm,
        dieselDebit: body.dieselDebit,
        vehicle: { connect: { id: body.vehicleId } },
        driver: { connect: { id: body.driverId } },
      });
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const body = req.body;
      const updateData: Record<string, unknown> = { ...body };
      if (body.date) updateData.date = new Date(body.date);
      if (body.vehicleId) {
        updateData.vehicle = { connect: { id: body.vehicleId } };
        delete updateData.vehicleId;
      }
      if (body.driverId) {
        updateData.driver = { connect: { id: body.driverId } };
        delete updateData.driverId;
      }
      const record = await contractVehicleService.update(id, updateData);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const record = await contractVehicleService.approve(id, req.user!.id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await contractVehicleService.delete(id);
      res.json({ success: true, message: "Contract vehicle record deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const contractVehicleController = new ContractVehicleController();
