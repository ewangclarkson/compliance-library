"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const AppConfigurationProperties_1 = __importDefault(require("../AppConfigurationProperties"));
const winston_elasticsearch_1 = require("winston-elasticsearch");
const winston = __importStar(require("winston"));
const ElasticClientManager_1 = __importDefault(require("../elasticsearch/ElasticClientManager"));
class ElasticsearchTransportManager {
    constructor(appConfigurations) {
        this.appConfigurations = appConfigurations;
        this.elasticTransport = new winston_elasticsearch_1.ElasticsearchTransport({
            client: ElasticClientManager_1.default.getInstance().getElasticClient(),
            index: this.appConfigurations.elasticLogsIndex,
            level: this.appConfigurations.elasticLoggingLevel
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ElasticsearchTransportManager(new AppConfigurationProperties_1.default());
        }
        return this.instance;
    }
    getElasticTransport() {
        return this.elasticTransport;
    }
}
exports.Logger = winston.createLogger({
    transports: [
        ElasticsearchTransportManager.getInstance().getElasticTransport()
    ]
});
//# sourceMappingURL=Logger.js.map