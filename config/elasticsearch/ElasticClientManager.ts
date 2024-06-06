import Client from "@elastic/elasticsearch/lib/client";
import AppConfigurationProperties from "../AppConfigurationProperties";

//singleton design pattern

export default class ElasticSearchClientManager {

    private readonly elasticClient: Client;
    private static instance: ElasticSearchClientManager;

    private constructor(private appConfigurations: AppConfigurationProperties) {

        this.elasticClient = new Client({
            cloud: {id: this.appConfigurations.elasticCloudId},
            auth: {
                username: this.appConfigurations.elasticUsername,
                password: this.appConfigurations.elasticPassword
            }
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new ElasticSearchClientManager(new AppConfigurationProperties());
        }
        return this.instance;
    }

    getElasticClient() {
        return this.elasticClient;
    }

}

