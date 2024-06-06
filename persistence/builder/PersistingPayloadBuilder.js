"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistingPayloadBuilder = void 0;
const PersistingPayload_1 = require("../dto/PersistingPayload");
class PersistingPayloadBuilder {
    constructor() { }
    static builder() {
        if (!this.instance) {
            this.instance = new PersistingPayloadBuilder();
        }
        return this.instance;
    }
    model(model) {
        this.modelClass = model;
        return this;
    }
    payload(data) {
        this.data = data;
        return this;
    }
    elasticIndex(index) {
        this.index = index;
        return this;
    }
    method(operation) {
        this.operation = operation;
        return this;
    }
    //key that should be use as the index id when persisting in elastic search
    primaryKey(elasticKey) {
        this.elasticKey = elasticKey;
        return this;
    }
    build() {
        if (!this.modelClass || !this.data || !this.index || !this.operation || !this.elasticKey)
            throw Error("all private fields must be populated");
        return new PersistingPayload_1.PersistingPayload({
            model: this.modelClass,
            data: this.data,
            index: this.index,
            operation: this.operation,
            elasticKey: this.elasticKey
        });
    }
}
exports.PersistingPayloadBuilder = PersistingPayloadBuilder;
PersistingPayloadBuilder.instance = null;
//# sourceMappingURL=PersistingPayloadBuilder.js.map