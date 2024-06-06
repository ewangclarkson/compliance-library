import KafkaPayload from "../dto/KafkaPayload";
import KafkaService from "./KafkaService";

export default interface KafkaCompliance {
    kafkaObserver(KAFKA_TOPIC: string, kafkaService: KafkaService): Promise<any>;

    kafkaRequest(KAFKA_TOPIC: string, payload: KafkaPayload): Promise<any>
}