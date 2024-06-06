import PersistenceFactory from "../PersistenceFactory";
import { PersistingPayload } from "../../dto/PersistingPayload";
import { RetrievingPayload } from "../../dto/RetrievingPayload";
export default class PersistenceFactoryImpl implements PersistenceFactory {
    private readonly connectionManager;
    private readonly persistenceFacade;
    constructor();
    persist(payload: PersistingPayload): Promise<{
        resource: any;
    }>;
    retrieve(payload: RetrievingPayload): Promise<{
        resource: any[];
    }>;
}
