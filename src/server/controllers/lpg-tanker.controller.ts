import { Request, Response, NextFunction } from "express";
import { lpgTankerService } from "../services/lpg-tanker.service";

export class LpgTankerController {
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
      const result = await lpgTankerService.findAll(page, limit, filters);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const record = await lpgTankerService.findById(id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const record = await lpgTankerService.create({
        month: body.month,
        year: body.year,
        serialNo: body.serialNo,
        date: new Date(body.date),
        tripId: body.tripId,
        loadQuantityPerTon: body.loadQuantityPerTon,
        km: body.km,
        fastag: body.fastag,
        tripStartDate: new Date(body.tripStartDate),
        tripEndDate: new Date(body.tripEndDate),
        unloadQuantityPerTon: body.unloadQuantityPerTon,
        shortage: body.shortage,
        wayExpense: body.wayExpense,
        others: body.others,
        dieselGiven: body.dieselGiven,
        excessDiesel: body.excessDiesel,
        dieselAmount: body.dieselAmount,
        advance: body.advance,
        totalExpense: body.totalExpense,
        ratePerTon: body.ratePerTon,
        freight: body.freight,
        vehicle: { connect: { id: body.vehicleId } },
        driver: { connect: { id: body.driverId } },
        loadingPlant: { connect: { id: body.loadingPlantId } },
        deliveryLocation: { connect: { id: body.deliveryLocationId } },
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
      if (body.tripStartDate) updateData.tripStartDate = new Date(body.tripStartDate);
      if (body.tripEndDate) updateData.tripEndDate = new Date(body.tripEndDate);
      if (body.vehicleId) {
        updateData.vehicle = { connect: { id: body.vehicleId } };
        delete updateData.vehicleId;
      }
      if (body.driverId) {
        updateData.driver = { connect: { id: body.driverId } };
        delete updateData.driverId;
      }
      if (body.loadingPlantId) {
        updateData.loadingPlant = { connect: { id: body.loadingPlantId } };
        delete updateData.loadingPlantId;
      }
      if (body.deliveryLocationId) {
        updateData.deliveryLocation = { connect: { id: body.deliveryLocationId } };
        delete updateData.deliveryLocationId;
      }
      const record = await lpgTankerService.update(id, updateData);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const record = await lpgTankerService.approve(id, req.user!.id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await lpgTankerService.delete(id);
      res.json({ success: true, message: "LPG Tanker record deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const lpgTankerController = new LpgTankerController();
