import {FacadePayload} from "../../dto/FacadePayload";
import {PersistenceOperation} from "../../PersistenceOperation";
import PersistenceManager from "../PersistenceManager";
import {Logger} from "../../../config/logging/Logger";

//integrate the logger
export class PersistenceManagerImpl implements PersistenceManager {
    private persistencePayload!: FacadePayload;
    private readonly elasticClient: any;

    constructor(elasticClient: any) {
        this.elasticClient = elasticClient;
    }

    async initializePersistingObject(payload: FacadePayload): Promise<void> {
        this.persistencePayload = payload;
    }

    async databasePersistence(): Promise<any> {
        let entity: any;
        try {
            switch (this.persistencePayload.operation) {
                case PersistenceOperation.CREATE:
                    entity = await this.persistencePayload.manager.save(this.persistencePayload.model, this.persistencePayload.data);
                    break;
                case PersistenceOperation.UPDATE:
                    await this.persistencePayload.manager.update(this.persistencePayload.model, {[this.persistencePayload.key]: this.persistencePayload.data[this.persistencePayload.key]}, this.persistencePayload.data);
                    entity = this.persistencePayload.data;
                    break;
                case PersistenceOperation.DELETE:
                    entity = this.persistencePayload.data[this.persistencePayload.key];
                    await this.persistencePayload.manager.remove(this.persistencePayload.model, this.persistencePayload.data);
                    this.persistencePayload.data[this.persistencePayload.key] = entity;
                    entity = this.persistencePayload.data;
                    break;
            }
            return entity;
        } catch (err) {
            Logger.error('Error persisting data in the database:', err);
            throw err;
        }
    }

    async elasticPersistence(entity: any): Promise<void> {
        try {
            switch (this.persistencePayload.operation) {
                case PersistenceOperation.CREATE:
                    await this.elasticClient
                        .index({
                            index: this.persistencePayload.index,
                            id: entity[this.persistencePayload.key],
                            document: entity
                        });
                    break;
                case PersistenceOperation.UPDATE:
                    await this.elasticClient
                        .update({
                            index: this.persistencePayload.index,
                            id: entity[this.persistencePayload.key],
                            doc: entity
                        });
                    break;
                case PersistenceOperation.DELETE:

                    await this.elasticClient
                        .delete({
                            id: entity[this.persistencePayload.key],
                            index: this.persistencePayload.index,
                        });
                    break;
            }
        } catch (err) {
            Logger.error('Error persisting data in Elasticsearch:', err);
            throw err;
        }
    }

    async retrieve(): Promise<any> {
        try {
            if (this.persistencePayload.data) {
                // Retrieve a single entity
                const response = await this.elasticClient
                    .get({
                        index: this.persistencePayload.index,
                        id: this.persistencePayload.data.id
                    });
                return [response._source];
            } else {
                // Retrieve all entities
                const response = await this.elasticClient
                    .search({
                        index: this.persistencePayload.index
                    });
                return response.hits.hits.map((hit: any) => hit._source);
            }
        } catch (err) {
            Logger.error('Error retrieving data from Elasticsearch:', err);
            throw err;
        }
    }
}
