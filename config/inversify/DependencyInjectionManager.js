"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const inversify_ioc_types_1 = require("./inversify.ioc.types");
const PersistenceFactoryImpl_1 = __importDefault(require("../../persistence/abstraction/implementation/PersistenceFactoryImpl"));
const SecurityComplianceImpl_1 = __importDefault(require("../../security/implementation/SecurityComplianceImpl"));
const AppConfigurationProperties_1 = __importDefault(require("../AppConfigurationProperties"));
const KafkaComplianceImpl_1 = __importDefault(require("../../kafka/abstraction/implementation/KafkaComplianceImpl"));
//singleton design
class DependencyInjectionManager {
    constructor() {
        this.container = new inversify_1.Container();
    }
    initializeBindings() {
        this.container.bind(inversify_ioc_types_1.DI.PersistenceFactory).to(PersistenceFactoryImpl_1.default);
        this.container.bind(inversify_ioc_types_1.DI.SecurityCompliance).to(SecurityComplianceImpl_1.default);
        this.container.bind(inversify_ioc_types_1.DI.KafkaCompliance).to(KafkaComplianceImpl_1.default);
        this.container.bind(inversify_ioc_types_1.DI.AppConfigurationProperties).to(AppConfigurationProperties_1.default);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new DependencyInjectionManager();
        }
        return this.instance;
    }
    getContainer() {
        return this.container;
    }
}
exports.default = DependencyInjectionManager;
//# sourceMappingURL=DependencyInjectionManager.js.map