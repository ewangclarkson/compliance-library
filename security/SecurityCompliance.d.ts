import { NextFunction, Request, Response } from "express";
export default interface SecurityCompliance {
    authCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    driverCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    adminCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    roleCompliance(roles: string[]): Promise<any>;
    generateToken(user: any): Promise<any>;
    uuidStandardCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
}
