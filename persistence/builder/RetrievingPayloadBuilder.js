"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievingPayloadBuilder = void 0;
const RetrievingPayload_1 = require("../dto/RetrievingPayload");
class RetrievingPayloadBuilder {
    constructor() {
        this.id = null;
    }
    static builder() {
        if (!this.instance) {
            this.instance = new RetrievingPayloadBuilder();
        }
        return this.instance;
    }
    model(model) {
        this.modelClass = model;
        return this;
    }
    elasticIndex(index) {
        this.index = index;
        return this;
    }
    //key that should be use when retrieving data from elastic search
    keyValue(id) {
        this.id = id;
        return this;
    }
    build() {
        if (!this.modelClass || !this.index)
            throw Error("all mandatory fields must be populated");
        return new RetrievingPayload_1.RetrievingPayload({
            model: this.modelClass,
            index: this.index,
            id: this.id
        });
    }
}
exports.RetrievingPayloadBuilder = RetrievingPayloadBuilder;
RetrievingPayloadBuilder.instance = null;
//# sourceMappingURL=RetrievingPayloadBuilder.js.map