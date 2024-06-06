import { NextFunction, Request, Response } from "express";
export declare function handleException(error: Error, request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>>;
