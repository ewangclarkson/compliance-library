import {PersistingPayload} from "../dto/PersistingPayload";
import {RetrievingPayload} from "../dto/RetrievingPayload";

export default interface PersistenceFactory {
    persist(payload: PersistingPayload): Promise<{ resource: any }>;

    retrieve(payload: RetrievingPayload): Promise<{ resource: any[] }>;
}
