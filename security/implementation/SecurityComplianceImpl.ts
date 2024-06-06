import {NextFunction, Request, Response} from "express";
import {sign, verify} from "jsonwebtoken"
import HttpStatus from "http-status";
import {validate} from "uuid";
import SecurityCompliance from "../SecurityCompliance";
import {inject, injectable} from "inversify";
import AppConfigurationProperties from "../../config/AppConfigurationProperties";
import {DI} from "../../config/inversify/inversify.ioc.types";
import {UserRoles} from "../../config/constants/UserRoles";

declare module 'express' {
    interface Request {
        user?: any
    }
}
//Follow dependency injection principle, SOLID principle and clean code
@injectable()
export default class SecurityComplianceImpl implements SecurityCompliance {

    private appConfiguration: AppConfigurationProperties;

    constructor(
        @inject(DI.AppConfigurationProperties) private appConfig: AppConfigurationProperties) {
        this.appConfiguration = appConfig;
    }

    async authCompliance(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const tokenString = request.header("Authorization") + '';
            if (tokenString.length === 0) return response.status(HttpStatus.FORBIDDEN).send("Access denied");

            const token = tokenString.replace("Bearer ", "");
            const user = await verify(token, this.appConfiguration.privateKey);

            if (!user) return response.status(HttpStatus.UNAUTHORIZED).send("Invalid user");

            request.user = user;

            next();
        } catch (exp) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An unexpected error occurred while authorizing user")
        }
    }

    async driverCompliance(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this.checkRoleAndProceed(request, response, next, UserRoles.DRIVER);
    }

    async adminCompliance(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this.checkRoleAndProceed(request, response, next, UserRoles.ADMIN);
    }


    async generateToken(user: any): Promise<any> {
        return sign(user, this.appConfiguration.privateKey, {expiresIn: this.appConfiguration.tokenExpiryTimeInHours});
    }

    async uuidStandardCompliance(request: Request, response: Response, next: NextFunction): Promise<any> {
        if (!validate(request.params.id)) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Invalid UUID id")
        }
        next();
    }

    async roleCompliance(roles: string[]): Promise<any> {
        return async (request: Request, response: Response, next: NextFunction) => {
            if (!this.containsAll(request.user.roles, roles)) {
                return response.status(HttpStatus.UNAUTHORIZED).send("Unable to access resource due to authorization issues");
            }
            next();
        };
    }

    //verify that all user roles contains all verifiable roles
    private containsAll(authUserRoles: string[], verifiableRoles: string[]): boolean {
        return verifiableRoles.every(role => authUserRoles.includes(role));
    }

    // follow don't repeat yourself (DRY) principle
    private checkRoleAndProceed(request: Request, response: Response, next: NextFunction, role: string): any {
        if (!request.user.roles.includes(role)) {
            return response.status(HttpStatus.UNAUTHORIZED).send("Unable to access resource due to authorization issues");
        }
        next();
    }
}