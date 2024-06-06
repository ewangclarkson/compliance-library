"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
const AppConfigurationProperties_1 = __importDefault(require("../../config/AppConfigurationProperties"));
const inversify_ioc_types_1 = require("../../config/inversify/inversify.ioc.types");
const UserRoles_1 = require("../../config/constants/UserRoles");
//Follow dependency injection principle, SOLID principle and clean code
let SecurityComplianceImpl = class SecurityComplianceImpl {
    constructor(appConfig) {
        this.appConfig = appConfig;
        this.appConfiguration = appConfig;
    }
    authCompliance(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenString = request.header("Authorization") + '';
                if (tokenString.length === 0)
                    return response.status(http_status_1.default.FORBIDDEN).send("Access denied");
                const token = tokenString.replace("Bearer ", "");
                const user = yield (0, jsonwebtoken_1.verify)(token, this.appConfiguration.privateKey);
                if (!user)
                    return response.status(http_status_1.default.UNAUTHORIZED).send("Invalid user");
                request.user = user;
                next();
            }
            catch (exp) {
                return response.status(http_status_1.default.INTERNAL_SERVER_ERROR).send("An unexpected error occurred while authorizing user");
            }
        });
    }
    driverCompliance(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.checkRoleAndProceed(request, response, next, UserRoles_1.UserRoles.DRIVER);
        });
    }
    adminCompliance(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.checkRoleAndProceed(request, response, next, UserRoles_1.UserRoles.ADMIN);
        });
    }
    generateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, jsonwebtoken_1.sign)(user, this.appConfiguration.privateKey, { expiresIn: this.appConfiguration.tokenExpiryTimeInHours });
        });
    }
    uuidStandardCompliance(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, uuid_1.validate)(request.params.id)) {
                return response.status(http_status_1.default.INTERNAL_SERVER_ERROR).send("Invalid UUID id");
            }
            next();
        });
    }
    roleCompliance(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            return (request, response, next) => __awaiter(this, void 0, void 0, function* () {
                if (!this.containsAll(request.user.roles, roles)) {
                    return response.status(http_status_1.default.UNAUTHORIZED).send("Unable to access resource due to authorization issues");
                }
                next();
            });
        });
    }
    //verify that all user roles contains all verifiable roles
    containsAll(authUserRoles, verifiableRoles) {
        return verifiableRoles.every(role => authUserRoles.includes(role));
    }
    // follow don't repeat yourself (DRY) principle
    checkRoleAndProceed(request, response, next, role) {
        if (!request.user.roles.includes(role)) {
            return response.status(http_status_1.default.UNAUTHORIZED).send("Unable to access resource due to authorization issues");
        }
        next();
    }
};
SecurityComplianceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_ioc_types_1.DI.AppConfigurationProperties)),
    __metadata("design:paramtypes", [AppConfigurationProperties_1.default])
], SecurityComplianceImpl);
exports.default = SecurityComplianceImpl;
//# sourceMappingURL=SecurityComplianceImpl.js.map