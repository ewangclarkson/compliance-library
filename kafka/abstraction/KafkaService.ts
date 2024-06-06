import KafkaPayload from "../dto/KafkaPayload";
import KafkaResponse from "../dto/KafkaResponse";

export default interface KafkaService {

    request(payload: KafkaPayload): Promise<KafkaResponse>;

    response(payload: KafkaPayload): Promise<void>;
}