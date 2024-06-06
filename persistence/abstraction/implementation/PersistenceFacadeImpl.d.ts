import { FacadePayload } from "../../dto/FacadePayload";
import PersistenceManager from "../PersistenceManager";
import PersistenceFacade from "../PersistenceFacade";
export default class PersistenceFacadeImpl implements PersistenceFacade {
    private readonly persistenceManager;
    constructor(persistenceManager: PersistenceManager);
    persist(payload: FacadePayload): Promise<any>;
    retrieve(payload: FacadePayload): Promise<any>;
}
