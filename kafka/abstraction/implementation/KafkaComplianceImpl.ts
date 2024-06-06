import KafkaCompliance from "../KafkaCompliance";
import {inject, injectable} from "inversify";
import {Consumer, EachMessagePayload, Kafka, Producer} from "kafkajs";
import AppConfigurationProperties from "../../../config/AppConfigurationProperties";
import {DI} from "../../../config/inversify/inversify.ioc.types";
import KafkaPayload from "../../dto/KafkaPayload";
import KafkaService from "../KafkaService";


@injectable()
export default class KafkaComplianceImpl implements KafkaCompliance {
    private readonly kafka: Kafka;
    private readonly appConfiguration: AppConfigurationProperties;

    constructor(
        @inject(DI.AppConfigurationProperties) appConfiguration: AppConfigurationProperties) {
        this.appConfiguration = appConfiguration;
        this.kafka = new Kafka({
            clientId: this.appConfiguration.kafkaGroupId,
            brokers: this.appConfiguration.kafkaBrokers.split(","),
            connectionTimeout: 3000,
            ssl: true,
            sasl: {
                mechanism: "plain",
                username: this.appConfiguration.kafkaUsername,
                password: this.appConfiguration.kafkaPassword
            }
        });
    }

    async kafkaObserver(KAFKA_TOPIC: string, kafkaService: KafkaService) {
        const producer: Producer = this.kafka.producer();
        const consumer: Consumer = this.kafka.consumer({groupId: this.appConfiguration.kafkaGroupId});

        await producer.connect();
        await consumer.connect();

        await consumer.subscribe({topic: KAFKA_TOPIC});

        await consumer.run({
            eachMessage: async ({topic, partition, message}: EachMessagePayload) => {
                const req = JSON.parse(message.value?.toString() || '');
                if (req.correlationId) {
                    //perform db operation
                    const response = await kafkaService.request(req);
                    await producer.send({
                        topic: req.replyTo,
                        messages: [{value: JSON.stringify(response)}],
                    });
                } else {
                    console.log(req);
                    await kafkaService.response(req);
                }
            }
        });
    };

    async kafkaRequest(KAFKA_TOPIC: string, payload: KafkaPayload): Promise<any> {

        const producer: Producer = this.kafka.producer();
        await producer.connect();
        await producer.send(
            {
                topic: KAFKA_TOPIC,
                messages: [{value: JSON.stringify(payload)}]
            });
        await producer.disconnect();

        return (payload.correlationId ? (
                new Promise(async (resolve, reject) => {
                    const consumer: Consumer = this.kafka.consumer({groupId: this.appConfiguration.kafkaGroupId});
                    await consumer.connect();
                    await consumer.subscribe({topic: payload.replyTo});

                    await consumer.run({
                        eachMessage: async ({message}: EachMessagePayload) => {
                            const response = JSON.parse(message.value?.toString() || '');
                            if (response.correlationId) {
                                (response.correlationId === payload.correlationId)
                                    ? resolve(response.payload)
                                    : reject("Failed to get resource");
                            } else {
                                reject("Failed to get resource");
                            }
                        },
                    });
                    await consumer.disconnect();
                }))
            : Promise.resolve(null));
    };
}