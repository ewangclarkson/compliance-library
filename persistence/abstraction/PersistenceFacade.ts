import {FacadePayload} from "../dto/FacadePayload";

export default interface PersistenceFacade{
    persist(payload: FacadePayload): Promise<any>;
    retrieve(payload: FacadePayload): Promise<any>;
}
