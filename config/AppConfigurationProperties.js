"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const inversify_1 = require("inversify");
const validator_1 = require("validator");
//clean architecture easy plug in and plug out
let AppConfigurationProperties = class AppConfigurationProperties {
    constructor() {
        this.privateKey = config_1.default.has('jwt.privateKey') ? config_1.default.get('jwt.privateKey') : '';
        this.tokenExpiryTimeInHours = config_1.default.has('jwt.expiresIn') ? config_1.default.get('jwt.expiresIn') : '2h';
        this.elasticCloudId = config_1.default.has("elasticSearch.cloudId") ? config_1.default.get("elasticSearch.cloudId") : '';
        this.elasticUsername = config_1.default.has("elasticSearch.username") ? config_1.default.get("elasticSearch.username") : '';
        this.elasticPassword = config_1.default.has("elasticSearch.password") ? config_1.default.get("elasticSearch.password") : '';
        this.elasticLogsIndex = config_1.default.has("elasticSearch.logsIndex") ? config_1.default.get("elasticSearch.logsIndex") : 'app_logs';
        this.elasticLoggingLevel = config_1.default.has("elasticSearch.loggingLevel") ? config_1.default.get("elasticSearch.loggingLevel") : 'info';
        this.databaseDriver = config_1.default.has("database.driver") ? config_1.default.get("database.driver") : '';
        this.databaseHost = config_1.default.has("database.host") ? config_1.default.get("database.host") : '';
        this.databasePort = config_1.default.has("database.port") ? (0, validator_1.trim)(config_1.default.get("database.port")) : '';
        this.databaseUsername = config_1.default.has("database.username") ? (0, validator_1.trim)(config_1.default.get("database.username")) : '';
        this.databasePassword = config_1.default.has("database.password") ? (0, validator_1.trim)(config_1.default.get("database.password")) : '';
        this.databaseName = config_1.default.has("database.name") ? config_1.default.get("database.name") : '';
        this.databaseConnectionUrl = config_1.default.has("database.connectionUrl") ? config_1.default.get("database.connectionUrl") : '';
        this.kafkaBrokers = config_1.default.has("kafka.brokers") ? config_1.default.get("kafka.brokers") : '';
        this.kafkaUsername = config_1.default.has("kafka.username") ? (0, validator_1.trim)(config_1.default.get("kafka.username")) : '';
        this.kafkaPassword = config_1.default.has("kafka.password") ? (0, validator_1.trim)(config_1.default.get("kafka.password")) : '';
        this.kafkaGroupId = config_1.default.has("kafka.groupId") ? config_1.default.get("kafka.groupId") : '';
    }
};
AppConfigurationProperties = __decorate([
    (0, inversify_1.injectable)()
], AppConfigurationProperties);
exports.default = AppConfigurationProperties;
//# sourceMappingURL=AppConfigurationProperties.js.map