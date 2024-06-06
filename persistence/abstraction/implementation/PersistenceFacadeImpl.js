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
//use facade design
class PersistenceFacadeImpl {
    constructor(persistenceManager) {
        this.persistenceManager = persistenceManager;
    }
    persist(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.persistenceManager.initializePersistingObject(payload);
            const resource = yield this.persistenceManager.databasePersistence();
            yield this.persistenceManager.elasticPersistence(resource);
            return Promise.resolve(resource);
        });
    }
    retrieve(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.persistenceManager.initializePersistingObject(payload);
            const resource = this.persistenceManager.retrieve();
            return Promise.resolve(resource);
        });
    }
}
exports.default = PersistenceFacadeImpl;
//# sourceMappingURL=PersistenceFacadeImpl.js.map