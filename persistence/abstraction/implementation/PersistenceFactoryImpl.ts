import {DataSource, EntityManager} from 'typeorm';
import {PersistenceOperation} from "../../PersistenceOperation";
import {FacadePayload} from "../../dto/FacadePayload";
import PersistenceFacadeImpl from "./PersistenceFacadeImpl";
import PersistenceFactory from "../PersistenceFactory";
import {PersistenceManagerImpl} from "./PersistenceManagerImpl";
import PersistenceFacade from "../PersistenceFacade";
import {injectable} from "inversify";
import DatabaseConfigurationManager from "../../../config/database/DatabaseConfigurationManager";
import ElasticSearchClientManager from "../../../config/elasticsearch/ElasticClientManager";
import {PersistingPayload} from "../../dto/PersistingPayload";
import {RetrievingPayload} from "../../dto/RetrievingPayload";
import {Logger} from "../../../config/logging/Logger";

@injectable()
export default class PersistenceFactoryImpl implements PersistenceFactory {

    private readonly connectionManager: DataSource;
    private readonly persistenceFacade: PersistenceFacade;

    constructor() {
        this.connectionManager = DatabaseConfigurationManager.getInstance().getDataSource();
        this.persistenceFacade = new PersistenceFacadeImpl(
            new PersistenceManagerImpl(ElasticSearchClientManager.getInstance().getElasticClient())
        );
    }

    async persist(payload: PersistingPayload): Promise<{ resource: any }> {
        let transaction: any;
        try {
            transaction = await this.connectionManager.transaction(async (manager: EntityManager) => {
                const facadePayload: FacadePayload = {
                    manager: manager,
                    operation: payload.operation,
                    model: payload.model,
                    index: payload.index,
                    data: payload.data,
                    key: payload.elasticKey
                };

                return await this.persistenceFacade.persist(facadePayload);
            });

            return {resource: transaction};
        } catch (err) {
            Logger.error('Error persisting data:', err);
            throw err;
        }
    }

    async retrieve(payload: RetrievingPayload): Promise<{ resource: any[] }> {
        let entity: any[];
        try {
            entity = await this.connectionManager.transaction(async (manager: EntityManager) => {
                const facadePayload: FacadePayload = {
                    manager: manager,
                    operation: PersistenceOperation.READ,
                    model: payload.model,
                    index: payload.index,
                    data: payload.id ? {id: payload.id} : undefined,
                    key: ''
                };

                return await this.persistenceFacade.retrieve(facadePayload);
            });

            return {resource: entity};
        } catch (err) {
            Logger.error('Error retrieving data:', err);
            throw err;
        }
    }
}


