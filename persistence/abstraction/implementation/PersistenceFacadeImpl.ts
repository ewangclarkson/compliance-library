import {FacadePayload} from "../../dto/FacadePayload";
import PersistenceManager from "../PersistenceManager";
import PersistenceFacade from "../PersistenceFacade";

//use facade design
export default class PersistenceFacadeImpl implements PersistenceFacade {
    private readonly persistenceManager: PersistenceManager;

    constructor(persistenceManager: PersistenceManager) {
        this.persistenceManager = persistenceManager;
    }

    async persist(payload: FacadePayload): Promise<any> {
        await this.persistenceManager.initializePersistingObject(payload);
        const resource = await this.persistenceManager.databasePersistence();
        await this.persistenceManager.elasticPersistence(resource);
        return Promise.resolve(resource);
    }

    async retrieve(payload: FacadePayload): Promise<any> {
        await this.persistenceManager.initializePersistingObject(payload);
        const resource = this.persistenceManager.retrieve();
        return Promise.resolve(resource);
    }
}