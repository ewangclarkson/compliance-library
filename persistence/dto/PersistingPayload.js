"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistingPayload = void 0;
//builder pattern
class PersistingPayload {
    constructor(payload) {
        this.model = payload.model;
        this.data = payload.data;
        this.index = payload.index;
        this.operation = payload.operation;
        this.elasticKey = payload.elasticKey;
    }
}
exports.PersistingPayload = PersistingPayload;
//# sourceMappingURL=PersistingPayload.js.map