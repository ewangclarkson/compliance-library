import Client from "@elastic/elasticsearch/lib/client";
export default class ElasticSearchClientManager {
    private appConfigurations;
    private readonly elasticClient;
    private static instance;
    private constructor();
    static getInstance(): ElasticSearchClientManager;
    getElasticClient(): Client;
}
