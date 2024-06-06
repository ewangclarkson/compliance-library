import { PersistenceOperation } from "../PersistenceOperation";
import { PersistingPayload } from "../dto/PersistingPayload";
export declare class PersistingPayloadBuilder {
    private modelClass;
    private data;
    private index;
    private operation;
    private elasticKey;
    private static instance;
    private constructor();
    static builder(): PersistingPayloadBuilder;
    model(model: new () => any): PersistingPayloadBuilder;
    payload(data: any): this;
    elasticIndex(index: string): PersistingPayloadBuilder;
    method(operation: PersistenceOperation): PersistingPayloadBuilder;
    primaryKey(elasticKey: string): this;
    build(): PersistingPayload;
}
