import {FacadePayload} from "../dto/FacadePayload";

export default interface PersistenceManager {

    initializePersistingObject(payload: FacadePayload): Promise<void>;

    databasePersistence(): Promise<any>;

    elasticPersistence(entity: any): Promise<void>;

    retrieve(): Promise<any>;
}