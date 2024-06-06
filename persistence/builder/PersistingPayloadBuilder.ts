import {PersistenceOperation} from "../PersistenceOperation";
import {PersistingPayload} from "../dto/PersistingPayload";

export class PersistingPayloadBuilder {
    private modelClass!: new () => any;
    private data!: any;
    private index!: string;
    private operation!: PersistenceOperation;
    private elasticKey!: string;
    private static instance: PersistingPayloadBuilder | null = null;

    private constructor() {}

    static builder(): PersistingPayloadBuilder {
        if (!this.instance) {
            this.instance = new PersistingPayloadBuilder();
        }
        return this.instance;
    }

    model(model: new () => any): PersistingPayloadBuilder {
        this.modelClass = model;
        return this;
    }

    payload(data: any) {
        this.data = data;
        return this;
    }

    elasticIndex(index: string): PersistingPayloadBuilder {
        this.index = index;
        return this;
    }

    method(operation: PersistenceOperation): PersistingPayloadBuilder {
        this.operation = operation;
        return this;
    }

    //key that should be use as the index id when persisting in elastic search
    primaryKey(elasticKey: string) {
        this.elasticKey = elasticKey;
        return this;
    }

    build(): PersistingPayload {

        if (!this.modelClass || !this.data || !this.index || !this.operation || !this.elasticKey) throw Error("all private fields must be populated");

        return new PersistingPayload({
            model: this.modelClass,
            data: this.data,
            index: this.index,
            operation: this.operation,
            elasticKey: this.elasticKey
        });
    }

}