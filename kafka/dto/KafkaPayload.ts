
export default class KafkaPayload {
    payload: any;
    correlationId!: string;
    replyTo!: string;
    incoming!: string;
}
