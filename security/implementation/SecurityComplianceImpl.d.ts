import { NextFunction, Request, Response } from "express";
import SecurityCompliance from "../SecurityCompliance";
import AppConfigurationProperties from "../../config/AppConfigurationProperties";
declare module 'express' {
    interface Request {
        user?: any;
    }
}
export default class SecurityComplianceImpl implements SecurityCompliance {
    private appConfig;
    private appConfiguration;
    constructor(appConfig: AppConfigurationProperties);
    authCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    driverCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    adminCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    generateToken(user: any): Promise<any>;
    uuidStandardCompliance(request: Request, response: Response, next: NextFunction): Promise<any>;
    roleCompliance(roles: string[]): Promise<any>;
    private containsAll;
    private checkRoleAndProceed;
}
