import AppConfigurationProperties from "../AppConfigurationProperties";
import {ElasticsearchTransport} from "winston-elasticsearch";
import * as winston from "winston";
import ElasticSearchClientManager from "../elasticsearch/ElasticClientManager";

class ElasticsearchTransportManager {

    private readonly elasticTransport: ElasticsearchTransport;
    private static instance: ElasticsearchTransportManager;

    private constructor(private appConfigurations: AppConfigurationProperties) {

        this.elasticTransport = new ElasticsearchTransport({
            client: ElasticSearchClientManager.getInstance().getElasticClient(),
            index: this.appConfigurations.elasticLogsIndex,
            level: this.appConfigurations.elasticLoggingLevel
        });

    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new ElasticsearchTransportManager(new AppConfigurationProperties());
        }
        return this.instance;
    }

    getElasticTransport() {
        return this.elasticTransport;
    }
}

export const Logger = winston.createLogger({
    transports: [
        ElasticsearchTransportManager.getInstance().getElasticTransport()
    ]
});
