export default class AppConfigurationProperties {
    readonly privateKey: string;
    readonly tokenExpiryTimeInHours: string;
    readonly elasticCloudId: string;
    readonly elasticUsername: string;
    readonly elasticPassword: string;
    readonly elasticLogsIndex: string;
    readonly elasticLoggingLevel: string;
    readonly databaseDriver: string;
    readonly databaseHost: string;
    readonly databasePort: string;
    readonly databaseUsername: string;
    readonly databasePassword: string;
    readonly databaseName: string;
    readonly databaseConnectionUrl: string;
    readonly kafkaBrokers: string;
    readonly kafkaUsername: string;
    readonly kafkaPassword: string;
    readonly kafkaGroupId: string;
}
