"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceManagerImpl = void 0;
const PersistenceOperation_1 = require("../../PersistenceOperation");
const Logger_1 = require("../../../config/logging/Logger");
//integrate the logger
class PersistenceManagerImpl {
    constructor(elasticClient) {
        this.elasticClient = elasticClient;
    }
    initializePersistingObject(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.persistencePayload = payload;
        });
    }
    databasePersistence() {
        return __awaiter(this, void 0, void 0, function* () {
            let entity;
            try {
                switch (this.persistencePayload.operation) {
                    case PersistenceOperation_1.PersistenceOperation.CREATE:
                        entity = yield this.persistencePayload.manager.save(this.persistencePayload.model, this.persistencePayload.data);
                        break;
                    case PersistenceOperation_1.PersistenceOperation.UPDATE:
                        yield this.persistencePayload.manager.update(this.persistencePayload.model, { [this.persistencePayload.key]: this.persistencePayload.data[this.persistencePayload.key] }, this.persistencePayload.data);
                        entity = this.persistencePayload.data;
                        break;
                    case PersistenceOperation_1.PersistenceOperation.DELETE:
                        entity = this.persistencePayload.data[this.persistencePayload.key];
                        yield this.persistencePayload.manager.remove(this.persistencePayload.model, this.persistencePayload.data);
                        this.persistencePayload.data[this.persistencePayload.key] = entity;
                        entity = this.persistencePayload.data;
                        break;
                }
                return entity;
            }
            catch (err) {
                Logger_1.Logger.error('Error persisting data in the database:', err);
                throw err;
            }
        });
    }
    elasticPersistence(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (this.persistencePayload.operation) {
                    case PersistenceOperation_1.PersistenceOperation.CREATE:
                        yield this.elasticClient
                            .index({
                            index: this.persistencePayload.index,
                            id: entity[this.persistencePayload.key],
                            document: entity
                        });
                        break;
                    case PersistenceOperation_1.PersistenceOperation.UPDATE:
                        yield this.elasticClient
                            .update({
                            index: this.persistencePayload.index,
                            id: entity[this.persistencePayload.key],
                            doc: entity
                        });
                        break;
                    case PersistenceOperation_1.PersistenceOperation.DELETE:
                        yield this.elasticClient
                            .delete({
                            id: entity[this.persistencePayload.key],
                            index: this.persistencePayload.index,
                        });
                        break;
                }
            }
            catch (err) {
                Logger_1.Logger.error('Error persisting data in Elasticsearch:', err);
                throw err;
            }
        });
    }
    retrieve() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.persistencePayload.data) {
                    // Retrieve a single entity
                    const response = yield this.elasticClient
                        .get({
                        index: this.persistencePayload.index,
                        id: this.persistencePayload.data.id
                    });
                    return [response._source];
                }
                else {
                    // Retrieve all entities
                    const response = yield this.elasticClient
                        .search({
                        index: this.persistencePayload.index
                    });
                    return response.hits.hits.map((hit) => hit._source);
                }
            }
            catch (err) {
                Logger_1.Logger.error('Error retrieving data from Elasticsearch:', err);
                throw err;
            }
        });
    }
}
exports.PersistenceManagerImpl = PersistenceManagerImpl;
//# sourceMappingURL=PersistenceManagerImpl.js.map