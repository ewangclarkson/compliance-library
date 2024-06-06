"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@elastic/elasticsearch/lib/client"));
const AppConfigurationProperties_1 = __importDefault(require("../AppConfigurationProperties"));
//singleton design pattern
class ElasticSearchClientManager {
    constructor(appConfigurations) {
        this.appConfigurations = appConfigurations;
        this.elasticClient = new client_1.default({
            cloud: { id: this.appConfigurations.elasticCloudId },
            auth: {
                username: this.appConfigurations.elasticUsername,
                password: this.appConfigurations.elasticPassword
            }
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ElasticSearchClientManager(new AppConfigurationProperties_1.default());
        }
        return this.instance;
    }
    getElasticClient() {
        return this.elasticClient;
    }
}
exports.default = ElasticSearchClientManager;
//# sourceMappingURL=ElasticClientManager.js.map