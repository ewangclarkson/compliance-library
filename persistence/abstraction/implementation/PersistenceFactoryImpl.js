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
const PersistenceOperation_1 = require("../../PersistenceOperation");
const PersistenceFacadeImpl_1 = __importDefault(require("./PersistenceFacadeImpl"));
const PersistenceManagerImpl_1 = require("./PersistenceManagerImpl");
const inversify_1 = require("inversify");
const DatabaseConfigurationManager_1 = __importDefault(require("../../../config/database/DatabaseConfigurationManager"));
const ElasticClientManager_1 = __importDefault(require("../../../config/elasticsearch/ElasticClientManager"));
const Logger_1 = require("../../../config/logging/Logger");
let PersistenceFactoryImpl = class PersistenceFactoryImpl {
    constructor() {
        this.connectionManager = DatabaseConfigurationManager_1.default.getInstance().getDataSource();
        this.persistenceFacade = new PersistenceFacadeImpl_1.default(new PersistenceManagerImpl_1.PersistenceManagerImpl(ElasticClientManager_1.default.getInstance().getElasticClient()));
    }
    persist(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield this.connectionManager.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                    const facadePayload = {
                        manager: manager,
                        operation: payload.operation,
                        model: payload.model,
                        index: payload.index,
                        data: payload.data,
                        key: payload.elasticKey
                    };
                    return yield this.persistenceFacade.persist(facadePayload);
                }));
                return { resource: transaction };
            }
            catch (err) {
                Logger_1.Logger.error('Error persisting data:', err);
                throw err;
            }
        });
    }
    retrieve(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity;
            try {
                entity = yield this.connectionManager.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                    const facadePayload = {
                        manager: manager,
                        operation: PersistenceOperation_1.PersistenceOperation.READ,
                        model: payload.model,
                        index: payload.index,
                        data: payload.id ? { id: payload.id } : undefined,
                        key: ''
                    };
                    return yield this.persistenceFacade.retrieve(facadePayload);
                }));
                return { resource: entity };
            }
            catch (err) {
                Logger_1.Logger.error('Error retrieving data:', err);
                throw err;
            }
        });
    }
};
PersistenceFactoryImpl = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PersistenceFactoryImpl);
exports.default = PersistenceFactoryImpl;
//# sourceMappingURL=PersistenceFactoryImpl.js.map