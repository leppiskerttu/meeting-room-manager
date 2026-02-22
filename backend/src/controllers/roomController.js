import { StatusCodes } from "http-status-codes";
import * as roomService from "../services/roomService.js";

export async function getRooms(req, res, next) {
  try {
    const { page = 1, limit = 10, search, minCapacity } = req.query;
    const result = await roomService.listRooms({
      page: Number(page),
      limit: Number(limit),
      search,
      minCapacity,
    });
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function createRoom(req, res, next) {
  try {
    const room = await roomService.createRoom(req.body);
    return res.status(StatusCodes.CREATED).json(room);
  } catch (err) {
    return next(err);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }
    return res.status(StatusCodes.OK).json(room);
  } catch (err) {
    return next(err);
  }
}

export async function deleteRoom(req, res, next) {
  try {
    await roomService.deleteRoom(req.params.id);
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
}


