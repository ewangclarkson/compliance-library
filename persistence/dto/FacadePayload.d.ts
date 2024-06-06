import { EntityManager } from "typeorm";
import { PersistenceOperation } from "../PersistenceOperation";
export declare class FacadePayload {
    manager: EntityManager;
    operation: PersistenceOperation;
    model: any;
    index: string;
    data?: any;
    key: string;
}
