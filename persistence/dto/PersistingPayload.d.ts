import { PersistenceOperation } from "../PersistenceOperation";
export declare class PersistingPayload {
    model: new () => any;
    data: any;
    index: string;
    operation: PersistenceOperation;
    elasticKey: string;
    constructor(payload: {
        model: new () => any;
        data: any;
        index: string;
        operation: PersistenceOperation;
        elasticKey: string;
    });
}
