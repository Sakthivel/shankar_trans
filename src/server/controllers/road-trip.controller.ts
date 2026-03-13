import { Request, Response, NextFunction } from "express";
import { roadTripService } from "../services/road-trip.service";

export class RoadTripController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        month: req.query.month as string | undefined,
        year: req.query.year as string | undefined,
        vehicleId: req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined,
        driverId: req.query.driverId ? parseInt(req.query.driverId as string) : undefined,
        tripId: req.query.tripId as string | undefined,
      };
      const result = await roadTripService.findAll(page, limit, filters);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const record = await roadTripService.findById(id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const record = await roadTripService.create({
        month: body.month,
        year: body.year,
        serialNo: body.serialNo,
        date: new Date(body.date),
        tripId: body.tripId,
        gcNo: body.gcNo,
        quantity: body.quantity,
        tripStartDate: new Date(body.tripStartDate),
        tripStartTime: body.tripStartTime,
        tripEndDate: new Date(body.tripEndDate),
        tripEndTime: body.tripEndTime,
        unloadQuantity: body.unloadQuantity,
        shortage: body.shortage,
        startKm: body.startKm,
        closeKm: body.closeKm,
        runningKm: body.runningKm,
        haltingDaysWithTime: body.haltingDaysWithTime,
        gcReceivedStatus: body.gcReceivedStatus,
        remarks: body.remarks ?? null,
        docUploadUrl: body.docUploadUrl ?? null,
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
      const record = await roadTripService.update(id, updateData);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const record = await roadTripService.approve(id, req.user!.id);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async uploadDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      const { docUploadUrl } = req.body;
      const record = await roadTripService.updateDocUrl(id, docUploadUrl);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id));
      await roadTripService.delete(id);
      res.json({ success: true, message: "Road trip record deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export const roadTripController = new RoadTripController();
