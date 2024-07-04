import config from "config";
import {injectable} from "inversify";
import {trim} from "validator";

//clean architecture easy plug in and plug out
@injectable()
export default class AppConfigurationProperties {
    public readonly privateKey: string = config.has('jwt.privateKey') ? config.get('jwt.privateKey') : '';
    public readonly tokenExpiryTimeInHours: string = config.has('jwt.expiresIn') ? config.get('jwt.expiresIn') : '2h';
    public readonly elasticCloudId: string = config.has("elasticSearch.cloudId") ? config.get("elasticSearch.cloudId") : '';
    public readonly elasticNodeUrl: string = config.has("elasticSearch.nodeUrl") ? config.get("elasticSearch.nodeUrl") : '';
    public readonly elasticUsername: string = config.has("elasticSearch.username") ? config.get("elasticSearch.username") : '';
    public readonly elasticPassword: string = config.has("elasticSearch.password") ? config.get("elasticSearch.password") : '';
    public readonly elasticLogsIndex: string = config.has("elasticSearch.logsIndex") ? config.get("elasticSearch.logsIndex") : 'app_logs';
    public readonly elasticLoggingLevel: string = config.has("elasticSearch.loggingLevel") ? config.get("elasticSearch.loggingLevel") : 'info';
    public readonly databaseDriver: string = config.has("database.driver") ? config.get("database.driver") : '';
    public readonly databaseHost: string = config.has("database.host") ? config.get("database.host") : '';
    public readonly databasePort: string = config.has("database.port") ? trim(config.get("database.port")) : '';
    public readonly databaseUsername: string = config.has("database.username") ? trim(config.get("database.username")) : '';
    public readonly databasePassword: string = config.has("database.password") ? trim(config.get("database.password")) : '';
    public readonly databaseName: string = config.has("database.name") ? config.get("database.name") : '';
    public readonly databaseConnectionUrl: string = config.has("database.connectionUrl") ? config.get("database.connectionUrl") : '';
    public readonly kafkaBrokers: string = config.has("kafka.brokers") ? config.get("kafka.brokers") : '';
    public readonly kafkaUsername: string = config.has("kafka.username") ? trim(config.get("kafka.username")) : '';
    public readonly kafkaPassword: string = config.has("kafka.password") ? trim(config.get("kafka.password")) : '';
    public readonly kafkaGroupId: string = config.has("kafka.groupId") ? config.get("kafka.groupId") : '';
}