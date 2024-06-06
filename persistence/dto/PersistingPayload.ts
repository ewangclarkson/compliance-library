import {PersistenceOperation} from "../PersistenceOperation";


//builder pattern

export class PersistingPayload {
     model!: new () => any;
     data!: any;
     index!: string;
     operation!: PersistenceOperation;
     elasticKey!: string;

    constructor(payload: { model: new () => any, data: any, index: string, operation: PersistenceOperation, elasticKey: string }) {
        this.model = payload.model;
        this.data = payload.data;
        this.index = payload.index;
        this.operation = payload.operation;
        this.elasticKey = payload.elasticKey;

    }
}