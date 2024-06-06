"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const kafkajs_1 = require("kafkajs");
const AppConfigurationProperties_1 = __importDefault(require("../../../config/AppConfigurationProperties"));
const inversify_ioc_types_1 = require("../../../config/inversify/inversify.ioc.types");
let KafkaComplianceImpl = class KafkaComplianceImpl {
    constructor(appConfiguration) {
        this.appConfiguration = appConfiguration;
        this.kafka = new kafkajs_1.Kafka({
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
    kafkaObserver(KAFKA_TOPIC, kafkaService) {
        return __awaiter(this, void 0, void 0, function* () {
            const producer = this.kafka.producer();
            const consumer = this.kafka.consumer({ groupId: this.appConfiguration.kafkaGroupId });
            yield producer.connect();
            yield consumer.connect();
            yield consumer.subscribe({ topic: KAFKA_TOPIC });
            yield consumer.run({
                eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const req = JSON.parse(((_a = message.value) === null || _a === void 0 ? void 0 : _a.toString()) || '');
                    if (req.correlationId) {
                        //perform db operation
                        const response = yield kafkaService.request(req);
                        yield producer.send({
                            topic: req.replyTo,
                            messages: [{ value: JSON.stringify(response) }],
                        });
                    }
                    else {
                        console.log(req);
                        yield kafkaService.response(req);
                    }
                })
            });
        });
    }
    ;
    kafkaRequest(KAFKA_TOPIC, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const producer = this.kafka.producer();
            yield producer.connect();
            yield producer.send({
                topic: KAFKA_TOPIC,
                messages: [{ value: JSON.stringify(payload) }]
            });
            yield producer.disconnect();
            return (payload.correlationId ? (new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const consumer = this.kafka.consumer({ groupId: this.appConfiguration.kafkaGroupId });
                yield consumer.connect();
                yield consumer.subscribe({ topic: payload.replyTo });
                yield consumer.run({
                    eachMessage: ({ message }) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const response = JSON.parse(((_a = message.value) === null || _a === void 0 ? void 0 : _a.toString()) || '');
                        if (response.correlationId) {
                            (response.correlationId === payload.correlationId)
                                ? resolve(response.payload)
                                : reject("Failed to get resource");
                        }
                        else {
                            reject("Failed to get resource");
                        }
                    }),
                });
                yield consumer.disconnect();
            })))
                : Promise.resolve(null));
        });
    }
    ;
};
KafkaComplianceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_ioc_types_1.DI.AppConfigurationProperties)),
    __metadata("design:paramtypes", [AppConfigurationProperties_1.default])
], KafkaComplianceImpl);
exports.default = KafkaComplianceImpl;
//# sourceMappingURL=KafkaComplianceImpl.js.map