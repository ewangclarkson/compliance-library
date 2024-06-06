import KafkaCompliance from "../KafkaCompliance";
import AppConfigurationProperties from "../../../config/AppConfigurationProperties";
import KafkaPayload from "../../dto/KafkaPayload";
import KafkaService from "../KafkaService";
export default class KafkaComplianceImpl implements KafkaCompliance {
    private readonly kafka;
    private readonly appConfiguration;
    constructor(appConfiguration: AppConfigurationProperties);
    kafkaObserver(KAFKA_TOPIC: string, kafkaService: KafkaService): Promise<void>;
    kafkaRequest(KAFKA_TOPIC: string, payload: KafkaPayload): Promise<any>;
}
