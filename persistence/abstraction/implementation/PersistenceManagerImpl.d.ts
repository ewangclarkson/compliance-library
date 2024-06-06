import { FacadePayload } from "../../dto/FacadePayload";
import PersistenceManager from "../PersistenceManager";
export declare class PersistenceManagerImpl implements PersistenceManager {
    private persistencePayload;
    private readonly elasticClient;
    constructor(elasticClient: any);
    initializePersistingObject(payload: FacadePayload): Promise<void>;
    databasePersistence(): Promise<any>;
    elasticPersistence(entity: any): Promise<void>;
    retrieve(): Promise<any>;
}
