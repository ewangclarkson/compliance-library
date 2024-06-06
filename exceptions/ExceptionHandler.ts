import {NextFunction, Request, Response} from "express";
import HttpStatus from "http-status";
import {Logger} from "../config/logging/Logger";

export function handleException(error: Error, request: Request, response: Response, next: NextFunction) {
    Logger.error("internal server error",error);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
}
